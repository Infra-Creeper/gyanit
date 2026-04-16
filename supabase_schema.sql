-- ============================================================
-- gyan.it — Supabase SQL Schema
-- Run this in your Supabase SQL Editor to create all tables.
-- ============================================================

-- 1. USER (base identity table)
CREATE TABLE IF NOT EXISTS "USER" (
  user_id   VARCHAR(25) PRIMARY KEY,
  user_name VARCHAR(25) NOT NULL,
  email     VARCHAR(30) UNIQUE NOT NULL,
  password  VARCHAR(50) NOT NULL,
  role      VARCHAR(15) CHECK (role IN ('Student', 'Instructor'))
);

-- 2. STUDENT
CREATE TABLE IF NOT EXISTS "STUDENT" (
  user_id VARCHAR(25) PRIMARY KEY REFERENCES "USER"(user_id) ON DELETE CASCADE
);

-- 3. INSTRUCTOR
CREATE TABLE IF NOT EXISTS "INSTRUCTOR" (
  user_id VARCHAR(25) PRIMARY KEY REFERENCES "USER"(user_id) ON DELETE CASCADE
);

-- 4. COURSE
CREATE TABLE IF NOT EXISTS "COURSE" (
  course_id     VARCHAR(15)  PRIMARY KEY,
  title         VARCHAR(50)  UNIQUE NOT NULL,
  description   VARCHAR(200) NOT NULL,
  domain        VARCHAR(25)  NOT NULL,
  instructor_id VARCHAR(25)  REFERENCES "INSTRUCTOR"(user_id) ON DELETE SET NULL
);

-- 5. MODULE
CREATE TABLE IF NOT EXISTS "MODULE" (
  module_id   VARCHAR(15) PRIMARY KEY,
  module_name VARCHAR(25) NOT NULL,
  module_no   INT         NOT NULL,
  course_id   VARCHAR(15) REFERENCES "COURSE"(course_id) ON DELETE CASCADE
);

-- 6. MATERIAL
CREATE TABLE IF NOT EXISTS "MATERIAL" (
  material_id   VARCHAR(15)  PRIMARY KEY,
  module_id     VARCHAR(15)  REFERENCES "MODULE"(module_id) ON DELETE CASCADE,
  title         VARCHAR(25)  NOT NULL,
  file_url      VARCHAR(100) UNIQUE,
  type          VARCHAR(15)  NOT NULL,
  description   VARCHAR(100),
  display_order INT          NOT NULL
);

-- 7. ASSIGNMENT
CREATE TABLE IF NOT EXISTS "ASSIGNMENT" (
  assignment_id VARCHAR(15) PRIMARY KEY,
  module_id     VARCHAR(15) REFERENCES "MODULE"(module_id) ON DELETE CASCADE
);

-- 8. QUESTION
CREATE TABLE IF NOT EXISTS "QUESTION" (
  q_id           VARCHAR(15)  PRIMARY KEY,
  assignment_id  VARCHAR(15)  REFERENCES "ASSIGNMENT"(assignment_id) ON DELETE CASCADE,
  question_text  VARCHAR(500) NOT NULL,
  correct_choice CHAR(1)      NOT NULL
);

-- 9. ENROLLMENT
CREATE TABLE IF NOT EXISTS "ENROLLMENT" (
  enroll_id  VARCHAR(15) PRIMARY KEY,
  student_id VARCHAR(25) REFERENCES "STUDENT"(user_id) ON DELETE CASCADE,
  course_id  VARCHAR(15) REFERENCES "COURSE"(course_id) ON DELETE CASCADE,
  enroll_time TIMESTAMP   NOT NULL DEFAULT now(),
  status     VARCHAR(15) CHECK (status IN ('In Progress', 'Completed')),
  UNIQUE(student_id, course_id)
);

-- 10. ATTEMPT
CREATE TABLE IF NOT EXISTS "ATTEMPT" (
  attempt_id    VARCHAR(15)   PRIMARY KEY,
  student_id    VARCHAR(25)   REFERENCES "STUDENT"(user_id) ON DELETE CASCADE,
  assignment_id VARCHAR(15)   REFERENCES "ASSIGNMENT"(assignment_id) ON DELETE CASCADE,
  time          TIMESTAMP     NOT NULL DEFAULT now(),
  score         DECIMAL(4,2)  NOT NULL
);

-- 11. DOUBT
CREATE TABLE IF NOT EXISTS "DOUBT" (
  doubt_id   VARCHAR(15)  PRIMARY KEY,
  student_id VARCHAR(25)  REFERENCES "STUDENT"(user_id) ON DELETE CASCADE,
  course_id  VARCHAR(15)  REFERENCES "COURSE"(course_id) ON DELETE CASCADE,
  doubt_text VARCHAR(300) NOT NULL,
  reply      VARCHAR(300)
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE "USER"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "STUDENT"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "INSTRUCTOR" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "COURSE"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MODULE"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MATERIAL"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ASSIGNMENT" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QUESTION"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ENROLLMENT" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ATTEMPT"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DOUBT"      ENABLE ROW LEVEL SECURITY;

-- Public read for courses, modules, materials, questions
CREATE POLICY "Public read courses"    ON "COURSE"     FOR SELECT USING (true);
CREATE POLICY "Public read modules"    ON "MODULE"     FOR SELECT USING (true);
CREATE POLICY "Public read materials"  ON "MATERIAL"   FOR SELECT USING (true);
CREATE POLICY "Public read questions"  ON "QUESTION"   FOR SELECT USING (true);
CREATE POLICY "Public read assignment" ON "ASSIGNMENT" FOR SELECT USING (true);

-- Students can only see/manage their own data
CREATE POLICY "Students own enrollment" ON "ENROLLMENT"
  FOR ALL USING (auth.uid()::text = student_id);

CREATE POLICY "Students own attempts" ON "ATTEMPT"
  FOR ALL USING (auth.uid()::text = student_id);

CREATE POLICY "Students own doubts" ON "DOUBT"
  FOR ALL USING (auth.uid()::text = student_id);

-- Instructors can manage their own courses
CREATE POLICY "Instructors manage courses" ON "COURSE"
  FOR ALL USING (auth.uid()::text = instructor_id);
