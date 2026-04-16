-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.Assignment (
  Assignment_id character varying NOT NULL,
  Module_id character varying,
  CONSTRAINT Assignment_pkey PRIMARY KEY (Assignment_id),
  CONSTRAINT Assignment_Module_id_fkey FOREIGN KEY (Module_id) REFERENCES public.Module(module_id)
);
CREATE TABLE public.Attempt (
  attempt_id character varying NOT NULL,
  student_id uuid,
  assignment_id character varying,
  score real NOT NULL,
  CONSTRAINT Attempt_pkey PRIMARY KEY (attempt_id),
  CONSTRAINT Attempt_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.Assignment(Assignment_id),
  CONSTRAINT Attempt_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.Student(user_id)
);
CREATE TABLE public.Course (
  course_id character varying NOT NULL,
  Title character varying NOT NULL UNIQUE,
  Description character varying NOT NULL,
  Domain character varying NOT NULL,
  Instructor_id uuid,
  CONSTRAINT Course_pkey PRIMARY KEY (course_id),
  CONSTRAINT Course_Instructor_id_fkey FOREIGN KEY (Instructor_id) REFERENCES public.Instructor(user_id)
);
CREATE TABLE public.Doubt (
  doubt_id character varying NOT NULL,
  student_id uuid,
  course_id character varying,
  doubt_text character varying NOT NULL,
  reply character varying,
  CONSTRAINT Doubt_pkey PRIMARY KEY (doubt_id),
  CONSTRAINT Doubt_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.Student(user_id),
  CONSTRAINT Doubt_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.Course(course_id)
);
CREATE TABLE public.Enrollment (
  enroll_id character varying NOT NULL,
  student_id uuid,
  course_id character varying,
  enroll_time timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'ist'::text),
  status character varying,
  CONSTRAINT Enrollment_pkey PRIMARY KEY (enroll_id),
  CONSTRAINT Enrollment_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.Course(course_id),
  CONSTRAINT Enrollment_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.user(user_id)
);
CREATE TABLE public.Instructor (
  user_id uuid NOT NULL,
  CONSTRAINT Instructor_pkey PRIMARY KEY (user_id),
  CONSTRAINT Instructor_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(user_id)
);
CREATE TABLE public.Material (
  material_id character varying NOT NULL,
  Module_id character varying,
  title character varying NOT NULL,
  File_url character varying NOT NULL UNIQUE,
  Type character varying,
  Description character varying,
  Display_order bigint NOT NULL,
  CONSTRAINT Material_pkey PRIMARY KEY (material_id),
  CONSTRAINT Material_Module_id_fkey FOREIGN KEY (Module_id) REFERENCES public.Module(module_id)
);
CREATE TABLE public.Module (
  module_id character varying NOT NULL,
  module_name character varying NOT NULL,
  module_no bigint NOT NULL,
  course_id character varying,
  CONSTRAINT Module_pkey PRIMARY KEY (module_id),
  CONSTRAINT Module_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.Course(course_id)
);
CREATE TABLE public.Question (
  q_id character varying NOT NULL,
  Assignment_id character varying,
  Question_text character varying NOT NULL,
  Correct_Choice character varying NOT NULL,
  CONSTRAINT Question_pkey PRIMARY KEY (q_id),
  CONSTRAINT Question_Assignment_id_fkey FOREIGN KEY (Assignment_id) REFERENCES public.Assignment(Assignment_id)
);
CREATE TABLE public.Student (
  user_id uuid NOT NULL,
  CONSTRAINT Student_pkey PRIMARY KEY (user_id),
  CONSTRAINT Student_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(user_id)
);
CREATE TABLE public.user (
  user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_name text NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  role text CHECK (role = ANY (ARRAY['Student'::text, 'Instructor'::text])),
  password text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_pkey PRIMARY KEY (user_id)
);