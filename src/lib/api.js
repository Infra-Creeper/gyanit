/**
 * api.js — All Supabase database calls.
 *
 * Every function returns { data, error }.
 * Swap the USE_MOCK flag to false once your Supabase schema is live.
 */

import { supabase } from './supabase';
import { COURSES, MODULES, QUIZ_QUESTIONS } from '../data/mockData';

// ─── Toggle: true = use local mock data, false = hit Supabase ───────────────
const USE_MOCK = false;

// ─── Courses ─────────────────────────────────────────────────────────────────

export async function fetchCourses({ domain } = {}) {
  if (USE_MOCK) {
    const data = domain ? COURSES.filter((c) => c.domainId === domain) : COURSES;
    return { data, error: null };
  }
  let query = supabase
    .from('Course')
    .select(`
      course_id,
      Title,
      Description,
      Domain,
      Instructor_id,
      Instructor ( user_id, user ( user_name ) )
    `);
  if (domain) query = query.eq('domain', domain);
  return query;
}

export async function fetchCourse(courseId) {
  if (USE_MOCK) {
    const data = COURSES.find((c) => c.id === courseId) || null;
    return { data, error: data ? null : { message: 'Course not found' } };
  }
  return supabase
    .from('COURSE')
    .select(`
      course_id, title, description, domain, instructor_id,
      INSTRUCTOR ( user_id, USER ( user_name ) ),
      MODULE ( module_id, module_name, module_no, MATERIAL (*), ASSIGNMENT (*) )
    `)
    .eq('course_id', courseId)
    .single();
}

export async function fetchModules(courseId) {
  if (USE_MOCK) return { data: MODULES, error: null };
  return supabase
    .from('MODULE')
    .select('*, MATERIAL(*), ASSIGNMENT(*, QUESTION(*))')
    .eq('course_id', courseId)
    .order('module_no');
}

// ─── Enrollment ──────────────────────────────────────────────────────────────

export async function enrollStudent(studentId, courseId) {
  if (USE_MOCK) return { data: { enroll_id: 'mock-enroll-1' }, error: null };
  return supabase.from('ENROLLMENT').insert({
    student_id: studentId,
    course_id: courseId,
    enroll_time: new Date().toISOString(),
    status: 'In Progress',
  }).select().single();
}

export async function fetchEnrollment(studentId, courseId) {
  if (USE_MOCK) return { data: null, error: null };
  return supabase
    .from('ENROLLMENT')
    .select('*')
    .eq('student_id', studentId)
    .eq('course_id', courseId)
    .maybeSingle();
}

export async function fetchEnrolledCourses(studentId) {
  if (USE_MOCK) return { data: COURSES.slice(0, 2), error: null };
  return supabase
    .from('ENROLLMENT')
    .select('*, COURSE(*)')
    .eq('student_id', studentId)
    .order('enroll_time', { ascending: false });
}

// ─── Quiz / Assignments ──────────────────────────────────────────────────────

export async function fetchQuestions(assignmentId) {
  if (USE_MOCK) return { data: QUIZ_QUESTIONS, error: null };
  return supabase
    .from('QUESTION')
    .select('*')
    .eq('assignment_id', assignmentId);
}

export async function submitAttempt(studentId, assignmentId, score) {
  if (USE_MOCK) return { data: { attempt_id: 'mock-attempt-1', score }, error: null };
  return supabase.from('ATTEMPT').insert({
    student_id: studentId,
    assignment_id: assignmentId,
    time: new Date().toISOString(),
    score,
  }).select().single();
}

export async function fetchAttempts(studentId, assignmentId) {
  if (USE_MOCK) return { data: [], error: null };
  return supabase
    .from('ATTEMPT')
    .select('*')
    .eq('student_id', studentId)
    .eq('assignment_id', assignmentId)
    .order('time', { ascending: false });
}

// ─── Doubts ──────────────────────────────────────────────────────────────────

export async function submitDoubt(studentId, courseId, doubtText) {
  if (USE_MOCK) return { data: { doubt_id: 'mock-doubt-1' }, error: null };
  return supabase.from('DOUBT').insert({
    student_id: studentId,
    course_id: courseId,
    doubt_text: doubtText,
  }).select().single();
}

export async function fetchDoubts(studentId, courseId) {
  if (USE_MOCK) return { data: [], error: null };
  return supabase
    .from('DOUBT')
    .select('*')
    .eq('student_id', studentId)
    .eq('course_id', courseId)
    .order('doubt_id', { ascending: false });
}
