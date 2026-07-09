# 奇门真实排盘算法模块设计

> 当前文档只定义真实奇门排盘引擎的目标、范围、输入输出、计算步骤、测试策略和代码文件规划。
> 本阶段不写复杂算法，不替换现有 mock 页面，不影响 `src/qimen-core` 里已有的 mock 规则与展示逻辑。

## 一、奇门引擎目标

奇门引擎用于在后续阶段接入真实排盘能力。

目标输入：

- 日期时间；
- 时区；
- 地点；
- 起局方式。

目标输出：

- 结构化奇门盘；
- 可追踪的计算中间信息；
- 可供工具页、报告页和复盘记录保存的 `chartJson`。

第一版引擎只负责“排出结构化盘面”，不直接生成断语、报告或营销文案。解释、评分、报告生成应在规则层或报告层处理，并保留规则依据。

## 二、第一版支持

第一版支持：

1. 时家奇门；
2. 转盘；
3. 拆补法；
4. 公历日期；
5. 北京时间；
6. 暂不支持真太阳时；
7. 暂不支持飞盘；
8. 暂不支持置闰。

范围说明：

- 第一版默认 `timezone = "Asia/Shanghai"`。
- `location` 先作为输入字段保存，不参与真太阳时修正。
- `dunType` 和 `juNumber` 由引擎自动判断。
- 不同流派的起局差异必须通过配置区分，不能混写在同一套结果里。

## 三、输入

建议输入类型：

```ts
type QimenEngineInput = {
  datetime: string;
  timezone: string;
  location?: {
    name?: string;
    longitude?: number;
    latitude?: number;
  };
  method: "拆补";
  dunType: "auto";
  juNumber: "auto";
};
```

字段说明：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `datetime` | `string` | 公历日期时间，ISO 字符串或可明确解析的本地时间。 |
| `timezone` | `string` | 第一版固定支持 `Asia/Shanghai` / 北京时间。 |
| `location` | `object?` | 可选地点信息，第一版只保存，不参与真太阳时计算。 |
| `method` | `"拆补"` | 第一版固定拆补法。 |
| `dunType` | `"auto"` | 自动判断阴遁/阳遁。 |
| `juNumber` | `"auto"` | 自动判断局数。 |

输入约束：

- 必须明确日期、小时和时区。
- 第一版不接受农历输入。
- 第一版不接受“飞盘”“置闰”“真太阳时”等模式参数。
- 输入解析失败时应返回结构化错误，不生成半成品盘。

## 四、输出

输出对象命名为 `QimenChart`，用于后续保存到数据库的 `QimenChart.palaces`、`QimenChart.inputSnapshot` 和报告生成依据中。

`QimenChart` 至少包含：

1. 公历时间；
2. 干支四柱；
3. 节气；
4. 阴遁/阳遁；
5. 局数；
6. 旬首；
7. 值符；
8. 值使；
9. 空亡；
10. 马星；
11. 九宫盘。

建议输出结构：

```ts
type QimenChart = {
  calendarTime: {
    datetime: string;
    timezone: string;
    location?: QimenEngineInput["location"];
  };
  ganzhi: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  jieqi: {
    name: string;
    boundary: "before" | "after" | "exact";
    at: string;
  };
  dunJu: {
    dunType: "阳遁" | "阴遁";
    juNumber: number;
    method: "拆补";
    style: "时家奇门" | "转盘";
  };
  xun: {
    xunShou: string;
    emptyBranches: string[];
  };
  zhi: {
    zhiFu: string;
    zhiShi: string;
  };
  markers: {
    kongWang: string[];
    maXing: string;
  };
  palaces: QimenPalace[];
  chartJson: Record<string, unknown>;
};
```

`QimenPalace` 建议包含：

```ts
type QimenPalace = {
  palaceNumber: number;
  palaceName: string;
  trigram: string;
  direction: string;
  element: "木" | "火" | "土" | "金" | "水";
  earthPlateStem?: string;
  heavenPlateStem?: string;
  star?: string;
  door?: string;
  deity?: string;
  branchLabels: string[];
  patterns: {
    shiganKeying: string[];
    menPo: boolean;
    ruMu: boolean;
    jiXing: boolean;
    fanYin: boolean;
    fuYin: boolean;
  };
};
```

输出约束：

- `chartJson` 必须可序列化。
- 输出必须保存 `method = "拆补"`、`style = "转盘"`、`timezone`、输入时间和计算版本。
- 后续报告必须保存该盘的生成依据，不允许只保存最终文案。

## 五、计算步骤

第一版计算步骤按固定流水线执行：

1. 计算干支四柱；
2. 判断节气；
3. 判断阴遁/阳遁；
4. 判断局数；
5. 布地盘三奇六仪；
6. 找旬首；
7. 定值符；
8. 定值使；
9. 值符随时干，排九星；
10. 值使随时宫，排八门；
11. 排八神；
12. 计算空亡；
13. 计算马星；
14. 识别十干克应；
15. 识别门迫、入墓、击刑、反吟、伏吟；
16. 输出结构化 `chartJson`。

### 步骤边界

1. 日历层只负责公历时间、时区、节气和干支基础，不处理宫位。
2. 遁局层只负责阴阳遁、局数、拆补法规则和起局参数。
3. 盘面层只负责九宫、三奇六仪、九星、八门、八神排布。
4. 格局层只负责十干克应、门迫、入墓、击刑、反吟、伏吟等标记。
5. 报告层不得反向修改盘面，只能读取 `chartJson` 和规则 trace。

### 版本记录

每次输出应保存：

- `engineVersion`；
- `method`；
- `style`；
- `timezone`；
- 是否启用真太阳时；
- 是否启用置闰；
- 是否启用飞盘。

第一版固定为：

```json
{
  "engineVersion": "qimen-engine-v1",
  "method": "拆补",
  "style": "转盘",
  "timezone": "Asia/Shanghai",
  "trueSolarTime": false,
  "zhiRun": false,
  "flyingPlate": false
}
```

## 六、测试策略

1. 必须建立 test cases；
2. 每个测试案例保存输入和期望输出；
3. 不同流派结果可能不同，必须在设置中标明起局方式；
4. 不要把不同流派混在一起。

### 测试案例格式

建议每个案例保存：

```ts
type QimenEngineTestCase = {
  id: string;
  title: string;
  input: QimenEngineInput;
  expected: {
    ganzhi?: {
      year?: string;
      month?: string;
      day?: string;
      hour?: string;
    };
    jieqi?: string;
    dunType?: "阳遁" | "阴遁";
    juNumber?: number;
    xunShou?: string;
    zhiFu?: string;
    zhiShi?: string;
    kongWang?: string[];
    maXing?: string;
    palaceChecks?: Array<{
      palaceNumber: number;
      earthPlateStem?: string;
      heavenPlateStem?: string;
      star?: string;
      door?: string;
      deity?: string;
    }>;
  };
  notes: string;
};
```

### 测试分层

- `calendar` 测试：只验证时间解析和北京时间边界。
- `ganzhi` 测试：只验证年、月、日、时四柱。
- `jieqi` 测试：只验证节气边界。
- `dunju` 测试：只验证阴阳遁和局数。
- `palace` 测试：只验证九宫基础排布。
- `patterns` 测试：只验证门迫、入墓、击刑、反吟、伏吟等标记。
- `chart` 集成测试：验证完整 `QimenChart`。

### 流派隔离

第一版测试目录只接受：

```json
{
  "method": "拆补",
  "style": "转盘",
  "timezone": "Asia/Shanghai",
  "trueSolarTime": false,
  "zhiRun": false,
  "flyingPlate": false
}
```

后续如果加入飞盘、置闰或真太阳时，必须建立独立 test suite，不能复用第一版期望值。

## 七、代码文件规划

后续代码文件规划如下：

```text
src/qimen-engine/calendar.ts
src/qimen-engine/ganzhi.ts
src/qimen-engine/jieqi.ts
src/qimen-engine/dunju.ts
src/qimen-engine/palace.ts
src/qimen-engine/chart.ts
src/qimen-engine/patterns.ts
src/qimen-engine/index.ts
src/qimen-engine/__tests__/qimen.test.ts
```

文件职责：

| 文件 | 职责 |
| --- | --- |
| `src/qimen-engine/calendar.ts` | 时间解析、北京时间规范化、基础日期工具。 |
| `src/qimen-engine/ganzhi.ts` | 干支、四柱、旬首、空亡相关计算。 |
| `src/qimen-engine/jieqi.ts` | 节气判断和节气边界数据。 |
| `src/qimen-engine/dunju.ts` | 拆补法、阴阳遁、局数判断。 |
| `src/qimen-engine/palace.ts` | 九宫、三奇六仪、九星、八门、八神排布。 |
| `src/qimen-engine/chart.ts` | 串联计算流水线并输出 `QimenChart` / `chartJson`。 |
| `src/qimen-engine/patterns.ts` | 十干克应、门迫、入墓、击刑、反吟、伏吟识别。 |
| `src/qimen-engine/index.ts` | 对外导出稳定 API。 |
| `src/qimen-engine/__tests__/qimen.test.ts` | 第一版拆补转盘测试案例。 |

## 实施顺序建议

1. 先建立测试案例数据和预期输出。
2. 再实现 `calendar`、`ganzhi`、`jieqi` 的基础层。
3. 再实现 `dunju` 和 `palace`。
4. 最后实现 `patterns` 和 `chart` 汇总。
5. 每一步都要用确定测试案例锁定结果，不用 AI 临场生成盘面。

## 当前阶段状态

- 已有页面仍使用 mock 数据和 `src/qimen-core` 的展示辅助规则。
- 本文档只定义真实奇门排盘引擎设计。
- 当前阶段不新增 `src/qimen-engine` 目录。
- 当前阶段不写真实算法。
