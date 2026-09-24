/* ===========================================================================
   POSITION CONTROL — roster.js
   The class lists behind the "Fast Access" tabs on the sign-in screen.

   A student picks their nickname instead of typing an ID, which is where most
   sign-in trouble comes from: a mistyped ID makes a second, empty account and
   the work done under it never reaches the class sheet.

   ---------------------------------------------------------------------------
   TO CHANGE THE CLASS

   Edit the lists below: each row is { id: '<student number>', name: '<nickname>' }.
   Order does not matter — the tab sorts by nickname. Two students may share a
   nickname; the dropdown shows the student number beside each.

   Anyone not on a list can still use the "Create account" tab. The roster is a
   convenience, never a gate. Nothing here is secret — passwords are not in it;
   each student sets their own the first time they sign in.
   =========================================================================== */

var ROSTER_GROUPS = [
  { key: 'm41', label: '4.1 Fast Access', cohort: 'M4.1', students: [
    /* Replace with the M4.1 class list, e.g. { id: '51022', name: 'Proud' }, */
    { id: '41001', name: 'Student A' },
    { id: '41002', name: 'Student B' },
    { id: '41003', name: 'Student C' }
  ] },
  { key: 'tut', label: 'Tutoring', cohort: 'Tutoring', students: [
    /* The private tutees: use a short id each, e.g. { id: 'tut-mint', name: 'Mint' } */
    { id: 'tut-one', name: 'Tutee One' },
    { id: 'tut-two', name: 'Tutee Two' }
  ] }
];

/* Flat list for code that only wants ids and names. */
var ROSTER = [];
ROSTER_GROUPS.forEach(function (g) { g.students.forEach(function (s) { ROSTER.push({ id: s.id, name: s.name, cohort: g.cohort }); }); });
