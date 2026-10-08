# Builds the four Google Notebook protocol files for the Template Lab manual (30 slides).
import hashlib, os, re, json
OUT = '/home/claude/slides'
LOCK = ('A photo-realistic, cinematic image of a friendly, focused female Thai secondary-school student with long dark hair neatly tied back with a white ribbon bow. '
 'Satriwithaya is an all-girls school: any other students visible in the background are also girls wearing the same lavender-white blouse and navy skirt. '
 'UNIFORM LOCK: the standard Thai girls\' school uniform exactly as in the image source "Pin and Uniform Reference" - a short-sleeved white school blouse with a faint lavender tint, pointed open collar, small white buttons, NO pocket, tucked into a navy-blue pleated skirt with a black belt; no blazer, jacket, tie or name tag. '
 'Exactly ONE small flat enamel school pin copied from panel 1 of the reference (an upright pointed shield like a fountain-pen nib, mostly cream-white enamel panels with tiny gold lettering, a narrow gold centre band with a small gold emblem near the top, thin gold outline; not a V or chevron, not maroon, not a crest) sits directly above the navy-blue embroidered Thai letters "ส.ว." - pin and letters form one small stacked unit on HER RIGHT chest, which is the LEFT side of the picture as we look at it. '
 'Her LEFT chest (the heart side, the RIGHT side of the picture) is smooth, plain lavender fabric with nothing on it. ')
POS_R = 'POSITION CHECK: she stands in the right third of the slide, body facing the camera; the pin and "ส.ว." are on the side of her chest nearer the CENTRE of the slide (the text-panel side), and the side of her chest nearer the slide\'s right edge is plain. '
POS_L = 'POSITION CHECK: she stands in the left third of the slide, body facing the camera; the pin and "ส.ว." are on the side of her chest nearer the LEFT EDGE of the slide, and the side of her chest nearer the centre of the slide (the text-panel side) is plain. '

RULES = '''VISUAL REFERENCE (READ FIRST)
This notebook contains an image source called "Pin and Uniform Reference". Panel 1 shows the school pin close up, panel 2 shows the real school uniform, and panel 3 shows a slide image that is correct. Every image in this deck MUST copy the pin, the embroidered letters and the blouse exactly as they appear in that image. If a written description below seems to conflict with the image, follow the image. The source "Reference_Imagery" is a visual style guide only: copy its look, never its text. Sources whose names begin "App screen" are screenshots of the Position Control app; when a slide asks for an app screen on a tablet or laptop, draw a clean, simplified version of that screenshot on the device screen (white cards, navy headings, small coloured pills), never a different app.

PROTAGONIST
Every background image MUST feature a friendly, focused female Thai secondary-school STUDENT with long dark hair neatly tied back with a white ribbon bow. The student may be a different girl from slide to slide; what never changes is the uniform, the pin, the letters and their position. She is always the student: never a teacher, tutor, examiner, officer or adult professional.
ALL-GIRLS SCHOOL: Satriwithaya is an all-girls school. Every person visible in any image is a girl. Background students, if any, are girls in the same lavender-white blouse and navy skirt with long hair tied back. Prefer settings with few background people.

THE STANDARD THAI GIRLS' SCHOOL UNIFORM (every slide)
A short-sleeved white school blouse with a faint lavender tint, a pointed open collar and small white buttons, tucked into a navy-blue pleated skirt with a plain black belt. NO blazer, NO jacket, NO cardigan, NO waistcoat, NO tie, NO epaulettes, NO dark or navy top, NO breast pocket, NO name tag, NO logo, NO rank insignia, NO extra text on the clothes.

THE SCHOOL PIN (copy panel 1 of the reference image)
Exactly ONE small flat enamel lapel pin. Shape: an upright pointed shield like a fountain-pen nib - a short flat top edge, two straight sides, and a lower half that tapers to ONE point at the bottom. Colour: mostly glossy CREAM-WHITE enamel with GOLD. Two white enamel panels, one on the left and one on the right, each carrying a line of tiny gold lettering; between them a narrow vertical GOLD centre band with a small ornate gold emblem near the top; a thin gold outline all round. Size: about as wide as the letters below it and a little taller than them.
The pin is NOT a V or chevron, NOT maroon, red or brown, NOT a military rank badge, NOT a coat of arms or crest, NOT round, oval, heart-shaped or teardrop-shaped, NOT a gemstone, and NOT mostly gold.

THE LETTERS AND THE PLACEMENT
Directly beneath the pin: the Thai letters "ส.ว." embroidered in navy-blue thread. Pin and letters form one small stacked unit, pin on top, letters underneath, close together.
The pin and letters are on the protagonist's RIGHT chest. In the picture, seen from the front, that is the LEFT side of the image. Her LEFT chest - her heart side, the RIGHT side of the image - is smooth, plain lavender fabric with nothing on it.
Why this matters: most uniforms put the badge over the heart, and image generators copy that habit. THIS UNIFORM IS THE OPPOSITE. Do not "balance" the blouse by adding anything to the other side.

HOW TO KEEP IT RIGHT IN EVERY IMAGE
Copy the UNIFORM LOCK sentence in each Background Image Prompt word for word into the image prompt. Keep her body facing the camera (turned no more than about 30 degrees) so the pin and letters are clearly visible. Never let her arms, hands, props, a tablet, a laptop or a text panel cover her chest: she holds devices low, at waist height, or they stand on a desk beside her. Never mirror or horizontally flip an image. No mirrors, reflections, selfies or reversed text.
Final check for every slide image: count the pins = exactly 1; the pin is a white-and-gold pointed shield like panel 1 (not a V, not maroon, not a crest); count "ส.ว." = exactly 1, directly under the pin; both on the LEFT half of her chest as we look at the picture; the RIGHT half of her chest is plain; she wears the lavender-white blouse and navy skirt, with no blazer or jacket. If any check fails, regenerate the image before moving on.

BACKGROUND STYLE
Photo-realistic, cinematic lighting, shallow depth of field. The protagonist is in focus; the setting behind her is softly blurred so the slide text stays readable, but her thematic action is clearly visible. Subtle glowing holographic elements in cyan and yellow relate to the slide's concept. DO NOT use vector art, cartoons or illustrations.

TEXT
Place all slide text in the foreground inside dark, semi-transparent rounded panels (dark grey/black at about 60% opacity) with stark white text. Panels sit beside the protagonist, never across her chest.
Words and phrases marked in double asterisks MUST appear bold and highlighted in a bright accent colour (cyan or yellow), unless the slide's DESIGN NOTE gives a different colour scheme. Do not show the asterisks.
Example sentences in quotation marks appear exactly as written, inside their own callout box with a glowing cyan or yellow border. Words in square brackets such as [Facet A] are slot labels: show them exactly, brackets included, as small amber chips.
Some slides have a DESIGN NOTE. Follow it for that slide's layout and colours.
Do not print any of these instructions, or the labels "Background Image Prompt", "UNIFORM LOCK", "POSITION CHECK", "DESIGN NOTE" or "ACTION", on the slides. Copy every title and content line exactly; do not add slides, facts, subtitles or slide numbers, and show each example once.
'''

D = {}
D['A'] = ('THE TEMPLATE LAB, PART 1: Your Template, Your Words', 'why a personal template works, the eleven variables, the four template shares and the five question types', [
 ['Build Your Own Template', 'unrolling a glowing cyan blueprint scroll across a library table, with the label "MY TEMPLATE" floating above it', [
   'Position Control app: the **Template Lab**',
   'Build a Task 2 template **once**, in your own words',
   'Fill it with **new ideas** for every prompt',
   'This guide: the idea, the **Blueprint Studio**, the **Assembly Line**, the **Scorecard**, and two worked examples'], 'Large title. Four short rows below it in one dark panel.'],
 ['Why Your Own Template?', 'placing a handwritten card labelled "MINE" in front of a faded printed card labelled "COPIED" that is crossed out in red, at a classroom desk', [
   'Examiners discount **memorised** language.',
   'A template is safe when it is **yours** and every slot is **filled for this prompt**.',
   'The marks live in your **variables**, not in the frame.',
   '"Same frame, new ideas, every time."'], 'Two-column contrast: left panel header "Copied frame" in red, right panel header "My frame" in green; the quote sits in a callout box across the bottom.'],
 ['Eleven Decisions, One Essay', 'touching one of eleven glowing tiles arranged in a grid on a large classroom screen beside her', [
   '1 Core Topic',
   '2 Facet A · 3 Mechanism A · 4 Example A · 5 Nuance A',
   '6 Facet B · 7 Mechanism B · 8 Example B · 9 Nuance B',
   '10 Position · 11 Rationale',
   'Your template has a **slot** for each one. In the exam you fill the slots.'], 'Show the eleven as numbered chips in three rows: row 1 (Core Topic) yellow, rows 2-3 (body paragraphs A and B) cyan, row 4 (Position, Rationale) yellow. A bottom bar reads "yellow = introduction and conclusion - cyan = body paragraphs".'],
 ['Your Lead-in Sets the Grammar', 'fitting a glowing puzzle piece shaped like a word into a sentence frame floating in front of a whiteboard', [
   '**works by** + an -ing phrase: "works by **diverting floodwater**"',
   '**because** + a full clause: "because **tunnels move the water away**"',
   '**such as** / **is** + a noun phrase: "such as **Bangkok\'s drainage tunnels**"',
   'Write each lead-in so you know which shape its slot needs.'], 'Numbered rows 1-3, each with the rule chip on the left and the example in a quote callout on the right.'],
 ['Four Template Shares', 'sliding a glowing lever along a horizontal scale marked 60, 50, 40 and 30 in a bright study room', [
   '**60%** Training frame · **50%** Guided frame',
   '**40%** Lean frame · **30%** Exam-ready frame',
   'Share = template words ÷ essay words (about 280)',
   'Research on IELTS scripts: own language is at least **40%** at Band 6, **50%** at Band 7, **59%** at Band 8 (Wray & Pegg, 2009)'], 'A horizontal bar split into two colours (gold = template, navy = your own words) shown at the four shares, stacked; the research line sits in a small panel at the bottom.'],
 ['Which Share Is Yours?', 'standing at a school corridor crossroads with three glowing signposts labelled "B1", "B2" and "C1"', [
   'Practise at **60%** to learn the moves.',
   'B1 writer: exam share **50%** or less',
   'B2 writer: exam share **40%** or less',
   'C1 writer: exam share **30%** or less',
   'The Scorecard shows which share works best for **you**.'], 'Three signpost rows for B1, B2 and C1, each with its share in a large yellow number.'],
 ['One Blueprint per Question Type', 'sorting five glowing folders, each with a short label, into a rack on a library shelf', [
   '**Discuss**: View A · View B · your verdict',
   '**Opinion**: Reason 1 · Reason 2 or the counter-argument · how far you agree',
   '**Advantages**: main advantage · main disadvantage · which outweighs',
   '**Problem**: main cause · the solution that answers it · what must happen',
   '**Two-part**: answer to question 1 · answer to question 2 · overall view'], 'Five rows in one table-like panel; the type name in a cyan chip on the left of each row. The folder labels on the props read DISCUSS, OPINION, ADVANTAGE, PROBLEM, TWO-PART.'],
 ['Your Route Through the Lab', 'walking along a glowing path on the floor of a school hall with five numbered stepping stones', [
   'Step 1 **Blueprint Studio**: build 14 lines at 60%',
   'Step 2 **Copy at another share**: 50%, 40%, 30%',
   'Step 3 **Assembly Line**: fill the 11 variables for a real prompt',
   'Step 4 **Scorecard**: compare your shares',
   'Step 5 **Examples**: compare with Nam (B1) and Fah (B2)'], 'Vertical stepper: five boxes joined by glowing down-arrows.'],
])
D['B'] = ('THE TEMPLATE LAB, PART 2: The Blueprint Studio', 'opening the Template Lab, setting up a blueprint, writing and coaching the fourteen lines, the Test Drive, and copying a blueprint to another share', [
 ['Open the Template Lab', 'holding a tablet low at waist height whose screen shows the app screen from the image source "App screen - Template Lab home", in a quiet classroom', [
   'Sign in to **Position Control**',
   'Open the **Template Lab** tab',
   'Four tabs: **Blueprint Studio** · **Assembly Line** · **Scorecard** · **Examples**',
   'Press **New blueprint**'], 'Text panel on the left; the tablet screen is clearly an app with four tabs across the top.'],
 ['Set Up in Four Steps', 'tapping the screen of a laptop on a desk beside her that shows the app screen from the image source "App screen - Question type"', [
   'Step 1 **Question type**',
   'Step 2 **Template share**: 60, 50, 40 or 30%',
   'Step 3 **Target level**: B1 · B2 · C1 · C2',
   'Step 4 **Name** your blueprint',
   'Your frame and your ideas should be at the **same level**.'], 'Stepper with four boxes; the last line in a yellow bar at the bottom.'],
 ['Fourteen Lines, One Job Each', 'arranging fourteen glowing cards into four groups on a large table in a library', [
   '**Introduction**: topic opener · the two sides · position preview',
   '**Body A**: topic sentence · mechanism · example · nuance',
   '**Body B**: topic sentence · mechanism · example · nuance',
   '**Conclusion**: opener · your position again · rationale'], 'Four rows, one per paragraph, each line shown as small chips; the group names in cyan.'],
 ['Write a Line', 'writing on a tablet held low at waist height whose screen shows the app screen from the image source "App screen - Line card", at a study desk', [
   'Read the line\'s **job** and the criterion it serves',
   'Study three examples, then **write your own**',
   'Insert slots with the **slot buttons**: [Facet A]',
   'Keep inside the **word budget** bar',
   'Press **Coach me**'], 'Numbered rows 1-5.'],
 ['What the Coach Checks', 'pointing at a glowing checklist panel with green ticks beside a window in a quiet classroom', [
   'Required slots · word budget · copied wording',
   'Clichés and robotic linkers ("Firstly", "Nowadays")',
   'Contractions and spelling',
   'Points: submitted **5** · does its job **10** · no errors **10** · on budget **5** · own words **5** · at your level **5**'], 'Two panels: checks on top, the points row as a strip of cyan chips at the bottom.'],
 ['The Coach at Work', 'crossing out a sentence on a glowing card and writing a better one underneath, in a school café with soft daylight', [
   'Nam\'s first draft:',
   '"Firstly, the first view is about [Facet A]."',
   'Coach: under budget (6 words, target 9-18), robotic linker',
   'Her final line:',
   '"The first view is mainly about [Facet A], which many people see as very important."'], 'Two quote callouts stacked: the first with a red border and label "Before", the second with a green border and label "After"; the coach line in a small grey panel between them.'],
 ['Test Drive Every Line', 'watching her sentence slide into a glowing essay page that floats above a rainy Bangkok street seen through a school window', [
   'Each line drops into a **real essay** on the Bangkok floods',
   'Switch the **question type** and **Band 6, 7 or 8** ideas',
   'Notes show the **shape** each slot needs',
   'See your frame carry real ideas **before** the exam'], 'Text panel beside her; the floating page shows a few highlighted phrases.'],
 ['Save, Then Go Leaner', 'trimming a long glowing ribbon of words into a shorter one with scissors on a library table', [
   'Review the blueprint, then **Save** (+50)',
   'Press **Copy at another share**: 60 → 50 → 40 → 30%',
   'Your lines arrive as drafts. Trim them **your way** and coach again.',
   '60%: "We can explain how this works in a very simple way: [Mechanism A]."',
   '30%: "This works because [Mechanism A]."'], 'The two example lines appear as stacked quote callouts labelled "60%" and "30%".'],
])
D['C'] = ('THE TEMPLATE LAB, PART 3: The Assembly Line and the Scorecard', 'using a blueprint on a real prompt, filling the eleven variables, the assembled essay and its checks, and the Scorecard', [
 ['Set Up a Run', 'choosing a glowing prompt card from a fan of cards in her hand, held low, in a quiet exam-preparation room with only a few girls seated far behind her', [
   'Step 1 Choose your **blueprint** (its share and level come with it)',
   'Step 2 Timing: **no limit** · **40 minutes** · **2 minutes per variable**',
   'Step 3 Choose a **prompt**: the badge "your Problem blueprint" shows the match'], 'Stepper with three boxes.'],
 ['Fill One Variable', 'typing on a laptop on a desk beside her whose screen shows the app screen from the image source "App screen - Variable card"', [
   'The card shows the variable\'s **job**, its **word target** and the **form** its slot needs',
   '**Where it goes in your essay**: your sentences, filled live',
   'Slots used twice need a **reworded** second mention (+5)',
   'Coach, revise (up to 3 tries), next variable'], 'Numbered rows 1-4.'],
 ['Nam Fills Her Problem Blueprint', 'pinning glowing notes onto a cork board in a quiet classroom at dusk, one note showing a crescent moon and a phone', [
   'Main cause: "the use of phones for chats and videos late at night"',
   'How it works: "chats and short videos keep teenagers awake long after bedtime"',
   'Second cause: "many students go to tutoring after school"',
   'Solution: "a family rule that keeps phones out of bedrooms"'], 'Four quote callouts in a 2 x 2 grid; the labels before the colons in cyan.'],
 ['Your Essay, Assembled', 'holding a printed essay page whose phrases glow in cyan, standing beside a window in a library', [
   'Your frame + your variables = **one essay**',
   'Your own words are **highlighted**',
   'Words · actual **template share** · time',
   'A band estimate for **TR · CC · LR · GRA** when the AI coach is online',
   '**Revise** as version 2 · **Send to LevelUp**'], 'One panel with five rows; the four criteria as small chips.'],
 ['The Pre-flight Check', 'pressing the last of ten glowing switches on a control panel in a school science lab', [
   'Position in the **introduction** and the **conclusion**',
   'Every part of the question answered',
   '**Mechanism + example + nuance** in each body paragraph',
   'Few sentences start with a linker',
   'No clichés · formal register · **250+ words**'], 'A checklist with green ticks; a small header chip reads "10-point check".'],
 ['The Scorecard', 'pointing at a glowing chart with four coloured lines rising across a whiteboard in an empty classroom', [
   'Lab points and rank: Apprentice → Draughtsman → Engineer → Architect → **Chief Engineer**',
   'A table of your runs at **60, 50, 40 and 30%**',
   'Your band run by run, for each share',
   'Find the share where **your** band is highest'], 'Rank ladder as a row of chips; chart lines in four colours with a legend bar reading "60% - 50% - 40% - 30%".'],
 ['Points for Every Run', 'catching glowing coins dropping from a floating hourglass in a school corridor', [
   'Complete run **+20**',
   'Inside 40 minutes **+30**',
   'Band × 10',
   'Beat your best at that share **+25**',
   'Award: **Full Spectrum** for a run at all four shares'], 'Numbered rows; the points in large yellow numbers.'],
])
D['D'] = ('THE TEMPLATE LAB, PART 4: Worked Examples from Nam and Fah', 'two worked examples (a B1 and a B2 student), their results at the four shares, what the reviewer found, and a checklist', [
 ['Meet Nam and Fah', 'opening the Examples tab on a tablet held low at waist height whose screen shows the app screen from the image source "App screen - Examples", in a bright library', [
   '**Nam**, B1 writer, target Band 5.5-6',
   '**Fah**, B2 writer, target Band 6.5-7',
   'Each built **5 blueprints** (one per type) at **60, 50, 40 and 30%**',
   '40 blueprints, 40 essays, each rated by an independent reviewer',
   'Open them in **Template Lab → Examples**'], 'Two profile panels side by side (Nam, Fah) above the last three lines.'],
 ['Less Template, Higher Band', 'climbing three glowing steps labelled 60, 40 and 30 on a school staircase', [
   'Nam: **6.0-6.5** at 60% → **6.5-7.0** at 30%',
   'Fah: **7.0** at 60% → **7.5** at 30%',
   'Same prompt, same ideas: only the share changed.',
   'Estimates against the public band descriptors, not official IELTS scores.'], 'Two rows of three numbered chips (60% / 40% / 30%) for Nam and Fah; the last line small at the bottom.'],
 ['Why Lower Shares Scored Higher', 'removing a heavy glowing frame from around a small picture so the picture can grow, in an art room', [
   'At 60%, long signposts read as **mechanical** (CC) and **formulaic** (LR).',
   'At 30%, one short signpost per move leaves room for **mechanisms** and **examples**.',
   '"We can explain how this works in a very simple way:" → "This works because"'], 'Two-column contrast: left header "60%" in amber, right header "30%" in green; the quote callout spans the bottom.'],
 ['The Type Decides the Plan', 'placing two glowing puzzle pieces labelled "CAUSE" and "SOLUTION" so that they lock together, at a desk by a rainy window', [
   '**Problem**: each named group needs its own developed measure',
   '**Advantages**: the prompt says "advantages", so develop **two**',
   '**Two-part**: answer the questions **in order**',
   'Nam lost marks in Task Response where one part got only a clause.'], 'Numbered rows; the last line in a yellow bar.'],
 ['Proofread Your Template', 'correcting a sentence on a glowing card with a cyan pen, in a quiet study corner', [
   '"Looking back at both questions, the picture is clearer."',
   '→ "Looking back at both questions, **I** can now see…"',
   '"This view does not work in every case." → "does not **hold**"',
   'A mistake in a template line repeats in **every** essay. Fix it once.'], 'Before/after quote callouts: originals with a red border, corrections with a green border.'],
 ['Your Checklist', 'ticking glowing boxes on a floating checklist beside the school gate in morning light', [
   'Build one blueprint for **one type** at 60%',
   'Copy it to **50 → 40 → 30%**',
   'Run each on a prompt **of that type**',
   'Compare your bands in the **Scorecard**',
   'Choose your exam share: B1 ≤ 50% · B2 ≤ 40% · C1 ≤ 30%'], 'Checklist with five boxes.'],
 ['Same Frame, New Ideas', 'smiling and holding a glowing blueprint low at her side as she walks into a bright exam hall with only a few girls seated far behind her', [
   'Your template is your **route**, not your answer.',
   'Your ideas carry the marks.',
   'Template Lab → **Examples**: see every step Nam and Fah took.'], 'Large closing title; three short lines in one panel.'],
])

files = {}
for X, (title, topics, slides) in D.items():
    n = len(slides)
    head = f'NOTEBOOKLM SLIDE DECK INSTRUCTIONS v1 - TEMPLATE LAB DECK {X}: {title}. Course: IELTS Writing Task 2 (Position Control app). Deck: {n} slides.\n'
    head += f'SYSTEM COMMAND: SLIDE GENERATION PROTOCOL - DECK {X} (Slides 1-{n})\n'
    head += f'You are a Visual Slide Generator. Produce a deck of {n} educational slides focusing on {topics}. The audience is Thai secondary-school students (CEFR B1-C1) aiming for IELTS Writing Band 6.5-8, and the deck is both a user manual for the Template Lab in the Position Control app and a lesson. Every image shows the student protagonist working with the slide\'s concept. Follow the exact content and aesthetic rules below. Use the slide text as written; all example sentences are original teaching material.\n\n'
    body = 'SLIDE DATA\n'
    for i, (t, action, content, note) in enumerate(slides, 1):
        body += ('Slide %d: %s Background Image Prompt: ' % (i, t)) + LOCK + (POS_R if i % 2 else POS_L) + 'ACTION: She is ' + action + '. ' + ('DESIGN NOTE: ' + note + ' ' if note else '') + 'Title: ' + t + ' Content:\n' + '\n'.join(content) + '\n'
        words = len(re.findall(r"[A-Za-z0-9']+", ' '.join(content)))
        if words > 62: print('WARN long', X, i, words)
        if len(t.split()) > 6: print('WARN title', X, i, t)
    txt = head + RULES + '\n' + body
    txt = txt.replace('—', ' - ').replace('–', '-')
    assert txt.count('UNIFORM LOCK:') == n
    fn = os.path.join(OUT, f'TemplateLab-Deck-{X}-protocol-v1.txt')
    open(fn, 'w').write(txt)
    files[X] = (fn, n, len(txt), hashlib.sha256(txt.encode()).hexdigest()[:12])
    json.dump({'X': X, 'title': title, 'topics': topics, 'slides': slides}, open(os.path.join(OUT, f'deck-{X}.json'), 'w'), ensure_ascii=False)
print(files, sum(v[1] for v in files.values()))
