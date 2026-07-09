-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nickname" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "gender" TEXT,
    "avatar_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "birth_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birth_date" DATETIME NOT NULL,
    "birth_time" TEXT NOT NULL,
    "birth_timezone" TEXT NOT NULL DEFAULT 'Asia/Shanghai',
    "birth_place" TEXT,
    "calendar_type" TEXT NOT NULL DEFAULT 'solar',
    "year_pillar" TEXT NOT NULL,
    "month_pillar" TEXT NOT NULL,
    "day_pillar" TEXT NOT NULL,
    "hour_pillar" TEXT NOT NULL,
    "day_master" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "birth_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "plan_type" TEXT NOT NULL DEFAULT 'free',
    "status" TEXT NOT NULL DEFAULT 'active',
    "start_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" DATETIME,
    "liuyao_quota_monthly" INTEGER NOT NULL DEFAULT 1,
    "liuyao_quota_used" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "daily_lessons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "lesson_date" DATETIME NOT NULL,
    "day_ganzhi" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "suitable" TEXT NOT NULL,
    "unsuitable" TEXT NOT NULL,
    "career_advice" TEXT NOT NULL,
    "money_advice" TEXT NOT NULL,
    "emotion_advice" TEXT NOT NULL,
    "relationship_advice" TEXT NOT NULL,
    "content_advice" TEXT NOT NULL,
    "lucky_color" TEXT NOT NULL,
    "suitable_direction" TEXT NOT NULL,
    "suitable_time_range" TEXT NOT NULL,
    "one_sentence" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "daily_lessons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "date_queries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "target_date" DATETIME NOT NULL,
    "target_ganzhi" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "suitable" TEXT NOT NULL,
    "unsuitable" TEXT NOT NULL,
    "time_advice" TEXT NOT NULL,
    "event_advice" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "date_queries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "event_queries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "target_date" DATETIME NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "suitability_level" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "action_advice" TEXT NOT NULL,
    "caution" TEXT NOT NULL,
    "recommended_time" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "event_queries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "liuyao_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "question_type" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "base_hexagram" TEXT NOT NULL,
    "changed_hexagram" TEXT NOT NULL,
    "moving_lines" TEXT NOT NULL,
    "result_summary" TEXT NOT NULL,
    "opportunity" TEXT NOT NULL,
    "obstacle" TEXT NOT NULL,
    "action_advice" TEXT NOT NULL,
    "is_lost_item" BOOLEAN NOT NULL DEFAULT false,
    "lost_item_name" TEXT,
    "lost_item_last_seen" TEXT,
    "lost_item_hint" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "liuyao_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bracelet_recommendations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "day_pillar" TEXT NOT NULL,
    "bracelet_name" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "product_image_url" TEXT,
    "product_link" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bracelet_recommendations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "consultations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "consultation_type" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'display',
    "remark" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "consultations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "admin_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "admin_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
