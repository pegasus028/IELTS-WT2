/* ===========================================================================
   POSITION CONTROL — media.js
   The introduction for each module: a podcast episode and a YouTube video.
   Loaded after the topic files and before engine.js. podcasts.html (the
   standalone listening page) loads this file and nothing else.

   ---------------------------------------------------------------------------
   PODCASTS
   The paths below are already wired for all fourteen modules. An MP3 at
   audio/module-NN.mp3 plays; a missing one shows "not recorded yet".

   VIDEOS — how to link one
   1. Upload the video to YouTube. Set Visibility to "Unlisted" (anyone with
      the link can watch, but it will not appear in search) or "Public".
      A "Private" video will NOT play inside the app.
   2. Make sure embedding is allowed: YouTube Studio → the video → Details →
      Show more → "Allow embedding" ticked (it is on by default).
   3. Click Share under the video and copy the link, e.g.
         https://youtu.be/mcXeQXkFbf8
      Any usual shape works: youtu.be/…, youtube.com/watch?v=…,
      youtube.com/shorts/…, youtube.com/embed/…
   4. Paste it between the quotes after  video:  on that module's line below,
      save, commit to GitHub. Then bump the ?v= number on the media.js
      <script> line in index.html, teacher.html and podcasts.html so phones
      fetch the new file instead of a cached copy.

   An empty video: '' means no Video button anywhere for that module, so
   videos can be added one at a time as they are made.
   =========================================================================== */

var MEDIA = {
  m00: { title: 'Module 00 · The Test',                                podcast: 'audio/module-00.mp3', video: '' },
  m01: { title: 'Module 01 · Decode the Prompt',                       podcast: 'audio/module-01.mp3', video: '' },
  m02: { title: 'Module 02 · Position',                                podcast: 'audio/module-02.mp3', video: '' },
  m03: { title: 'Module 03 · Matrix I — Core Topic and Facets',        podcast: 'audio/module-03.mp3', video: '' },
  m04: { title: 'Module 04 · Matrix II — Mechanism, Example, Nuance',  podcast: 'audio/module-04.mp3', video: '' },
  m05: { title: 'Module 05 · The Template',                            podcast: 'audio/module-05.mp3', video: '' },
  m06: { title: 'Module 06 · Synthesis',                               podcast: 'audio/module-06.mp3', video: '' },
  m07: { title: 'Module 07 · Cohesion',                                podcast: 'audio/module-07.mp3', video: '' },
  m08: { title: 'Module 08 · Nominalisation',                          podcast: 'audio/module-08.mp3', video: '' },
  m09: { title: 'Module 09 · Structural Swaps',                        podcast: 'audio/module-09.mp3', video: '' },
  m10: { title: 'Module 10 · Collocation and Register',                podcast: 'audio/module-10.mp3', video: '' },
  m11: { title: 'Module 11 · Accuracy',                                podcast: 'audio/module-11.mp3', video: '' },
  m12: { title: 'Module 12 · Playbooks',                               podcast: 'audio/module-12.mp3', video: '' },
  m13: { title: 'Module 13 · Exam Day',                                podcast: 'audio/module-13.mp3', video: '' }
};

/* Attach the media to each module, when the full app is loaded. */
(function () {
  if (typeof window === 'undefined' || !window.CONTENT || !window.CONTENT.TOPICS) return;
  window.CONTENT.TOPICS.forEach(function (t) {
    var m = MEDIA[t.id] || {};
    t.podcast = m.podcast || '';
    t.video = m.video || '';
  });
})();
