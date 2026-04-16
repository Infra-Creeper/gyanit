/**
 * api.js — All Supabase database calls.
 *
 * USE_MOCK is auto-detected: if real Supabase credentials are present in
 * the environment, it hits Supabase. Otherwise it falls back to mock data
 * so the app always works out of the box.
 *
 * To go live: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
 * with your real project values and USE_MOCK will automatically become false.
 */

import { supabase } from './supabase';
import { COURSES, MODULES, QUIZ_QUESTIONS } from '../data/mockData';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

function generateId(prefix = '') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}${crypto.randomUUID()}`;
  }
  return `${prefix}${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
}

// Auto-detect: only use Supabase when both vars are set AND look like real values
const USE_MOCK =
  !SUPABASE_URL ||
  !SUPABASE_KEY ||
  SUPABASE_URL.includes('placeholder') ||
  SUPABASE_KEY === 'placeholder' ||
  SUPABASE_KEY.length < 32;

if (USE_MOCK) {
  console.info(
    '[gyan.it] Running with mock data.\n' +
    'To connect Supabase: copy .env.example → .env.local and fill in your credentials.'
  );
}

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
  //if (domain) query = query.eq('Domain', domain);
  console.log(query)
  return query;
}

export async function fetchCourse(courseId) {
  if (USE_MOCK) {
    const data = COURSES.find((c) => c.id === courseId) || null;
    return { data, error: data ? null : { message: 'Course not found' } };
  }
  return supabase
    .from('Course')
    .select(`
      course_id, Title, Description, Domain, Instructor_id,
      INSTRUCTOR ( user_id, user ( user_name ) ),
      MODULE ( module_id, module_name, module_no, MATERIAL (*), ASSIGNMENT (*) )
    `)
    .eq('course_id', courseId)
    .single();
}

export async function fetchModules(courseId) {
  if (USE_MOCK) return { data: MODULES, error: null };
  return supabase
    .from('Module')
    .select('*, MATERIAL(*), ASSIGNMENT(*, QUESTION(*))')
    .eq('course_id', courseId)
    .order('module_no');
}

// ─── Enrollment ──────────────────────────────────────────────────────────────

export async function enrollStudent(studentId, courseId) {
  if (USE_MOCK) return { data: { enroll_id: 'mock-enroll-1' }, error: null };
  return supabase.from('Enrollment').insert({
    enroll_id: generateId('enroll-'),
    student_id: studentId,
    course_id: courseId,
    enroll_time: new Date().toISOString(),
    status: 'In Progress',
  }).select().single();
}

export async function fetchEnrollment(studentId, courseId) {
  if (USE_MOCK) return { data: null, error: null };
  return supabase
    .from('Enrollment')
    .select('*')
    .eq('student_id', studentId)
    .eq('course_id', courseId)
    .maybeSingle();
}

export async function fetchEnrolledCourses(studentId) {
  if (USE_MOCK) return { data: COURSES.slice(0, 2), error: null };
  return supabase
    .from('Enrollment')
    .select('*, COURSE(*)')
    .eq('student_id', studentId)
    .order('enroll_time', { ascending: false });
}

// ─── Quiz / Assignments ──────────────────────────────────────────────────────

export async function fetchQuestions(assignmentId) {
  if (USE_MOCK) return { data: QUIZ_QUESTIONS, error: null };
  return supabase
    .from('Question')
    .select('*')
    .eq('Assignment_id', assignmentId);
}

export async function submitAttempt(studentId, assignmentId, score) {
  if (USE_MOCK) return { data: { attempt_id: 'mock-attempt-1', score }, error: null };
  return supabase.from('Attempt').insert({
    attempt_id: generateId('attempt-'),
    student_id: studentId,
    assignment_id: assignmentId,
    score,
  }).select().single();
}

export async function fetchAttempts(studentId, assignmentId) {
  if (USE_MOCK) return { data: [], error: null };
  return supabase
    .from('Attempt')
    .select('*')
    .eq('student_id', studentId)
    .eq('assignment_id', assignmentId);
}

// ─── Doubts ──────────────────────────────────────────────────────────────────

export async function submitDoubt(studentId, courseId, doubtText) {
  if (USE_MOCK) return { data: { doubt_id: 'mock-doubt-1' }, error: null };
  return supabase.from('Doubt').insert({
    doubt_id: generateId('doubt-'),
    student_id: studentId,
    course_id: courseId,
    doubt_text: doubtText,
  }).select().single();
}

export async function fetchDoubts(studentId, courseId) {
  if (USE_MOCK) return { data: [], error: null };
  return supabase
    .from('Doubt')
    .select('*')
    .eq('student_id', studentId)
    .eq('course_id', courseId)
    .order('doubt_id', { ascending: false });
}
