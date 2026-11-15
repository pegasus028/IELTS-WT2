# Findings for T.Chris from the guidance build (15 Nov 2026)

Things noticed while building the High / Medium guidance on `p-cars-city`. None of them was changed: each needs your decision. New findings from the other 36 prompts are added here, one line each, by prompt.

## The B2 Universal Spine starter wording (template.js `b2-u-*`), now the wording of every High essay

1. **Dangling participle in the conclusion line.** "Taking {facetA} together with {facetB}, this is the most reasonable view, because …": the subject of "Taking" should be the writer, but the sentence's subject is "this". An examiner may count it as a grammar slip, and every High essay now ends with it. Options: "Weighing {facetA} against {facetB}, I find this the most reasonable view, because …" or "When {facetA} is weighed against {facetB}, this is the most reasonable view, because …".
2. **"The first key point is" twice.** The introduction says "The first key point is {facetA}, and the second is {facetB}", and Body A opens "The first key point is {facetA}". The scripts use a short form of each facet in the introduction to soften the repeat, but the frame words still repeat exactly. Option: Body A "The first of these is {facetA}." / Body B "The second is {facetB}."
3. **"This essay looks at both" for Problem and Two-part prompts** (already flagged in the skill, 13 Oct). With your choice of the Spine wording it will appear in the High essays of the problem and two-part prompts, where "both" means the cause and the solution, or the two questions. It reads acceptably but not naturally. Option: "This essay argues that {position}." for every type.
4. **"It operates through {mechB}"** with an -ing mechanism ("It operates through protecting the right of people …") is correct but heavy. Option: "It works by {mechB}" as in Body A, or "It rests on {mechB}".
5. **The opening line** "The question of {core} matters to many people today." is a generic opener that adds to template share and says little. Option: "{Core}, in its own words, divides opinion." Low priority.

## Prompt content

6. `p-cars-city` `vars.B2.exA` "Bans on petrol and diesel engines in **marked** central districts": "marked" is unusual here ("designated" at C1, "chosen" or "certain" at B2). Kept, because the Duelling Hall uses the same text and the two must not disagree.

## App behaviour

7. **The `position` Ward only recognises a restated position when it starts with one of its listed subjects** ("cities / councils / governments … should"), so "city leaders should …" in a conclusion is reported as "not restated" (the known open item in the app notes). The scripts work round it; the Ward itself is unchanged.
