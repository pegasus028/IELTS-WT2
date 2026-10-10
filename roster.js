/* ===========================================================================
   QUILLMOOR ACADEMY (was Position Control) — roster.js
   The class lists behind the "Fast Access" tabs on the sign-in screen.

   A student picks their nickname instead of typing an ID, which is where most
   sign-in trouble comes from: a mistyped ID makes a second, empty account and
   the work done under it never reaches the class sheet.

   ---------------------------------------------------------------------------
   TO CHANGE THE CLASS

   Edit the lists below: each row is { id: '<student id>', name: '<nickname>' }.
   M4.1 moved to the Task 1 app in Oct 2026, so only the tutees are listed.
   Order does not matter — the tab sorts by nickname. Two students may share a
   nickname; the dropdown shows the student number beside each.

   Anyone not on a list can still use the "Create account" tab. The roster is a
   convenience, never a gate. Nothing here is secret — passwords are not in it;
   each student sets their own the first time they sign in.
   =========================================================================== */

var ROSTER_GROUPS = [
  { key: 'tut', label: 'Quillmoor tutees', cohort: 'Tutoring', students: [
    { id: 'tut-aeh', name: 'Aeh' },
    { id: 'tut-mikii', name: 'Mikii' },
    { id: 'tut-donut', name: 'Donut' },
    { id: 'tut-jingjing', name: 'JingJing' },
    { id: 'tut-pear', name: 'Pear' }
  ] }
];

/* Flat list for code that only wants ids and names. */
var ROSTER = [];
ROSTER_GROUPS.forEach(function (g) { g.students.forEach(function (s) { ROSTER.push({ id: s.id, name: s.name, cohort: g.cohort }); }); });
