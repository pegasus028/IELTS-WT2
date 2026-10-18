/* ===========================================================================
   QUILLMOOR ACADEMY — prompts-mock.js
   The three MOCK-ONLY Task 2 prompts (WP12, 19 Oct 2026). Same shape as
   prompts.js (id, n, type, domain, level, schema, title, text, keyNouns,
   vars.C1/B2, modelId), plus mock: true. Every prompt is ORIGINAL.

   Why a separate file: a mock must measure readiness, not familiarity. The
   old mocks used practice prompts (p-tourism, p-teen-jobs, p-teen-sleep) that
   a student had already duelled, written, cast and read a model answer for.
   These three topics appear nowhere else in the app.

   ISOLATION
   - They live in CONTENT.MOCK_PROMPTS, NEVER in CONTENT.PROMPTS. Every list a
     student practises from is built from CONTENT.PROMPTS (Scriptorium grid,
     Duelling Hall, Spellbook Workshop, daily sets, weekly examination, the
     Staff Room assignment and projector pickers), so none of them shows these.
   - Prompts.get(id) (writer.js) is extended below so the writer, the Ten
     Wards, the report card, the Staff Room and the LevelUp hand-off find them.
     Prompts.all() still returns the practice bank only.
   - No model (modelId ''), no A2/B1 duel sets, no lesson item may name them.
     tools/validate.js fails the build if any of that changes.
   Load order: after content.js; the Prompts.get hook needs writer.js loaded
   first (index.html and teacher.html put this file straight after writer.js).
   =========================================================================== */
(function () {
  var C = window.CONTENT;
  if (!C) return;
  var M = C.MOCK_PROMPTS = C.MOCK_PROMPTS || [];

  /* -------------------------------------------------- 101 DISCUSS (mock 1) */
  M.push({
    id: "p-mock-degree-choice", n: 101, type: "DISCUSS", domain: "education", level: 'B2', schema: "freedom-regulation", title: "Who chooses the degree", mock: true,
    text: "Some parents believe they should choose the subject their child studies at university, because they have more experience of life and work. Others argue that young people must be free to make this decision for themselves. Discuss both views and give your own opinion.",
    keyNouns: ["parent", "subject", "universit", "young"],
    vars: { C1: {
      core: { ok: "The authority to determine a young person's field of university study.", d: ["The influence that parents exert over every aspect of an adolescent's life.", "The escalating cost of higher education for families on ordinary incomes.", "The pressure that competitive entrance examinations place on secondary students."] },
      facetA: { ok: "The experience of the labour market that parents bring to the decision.", d: ["The intrinsic motivation of students who select their own degree course.", "The considerable sums that families invest in private tuition before university.", "The ambition of many parents to see their child qualify as a doctor."] },
      mechA: { ok: "drawing on first-hand knowledge of employment to steer a child towards courses with genuine prospects", d: ["forbidding a child to apply for any course that her parents have not sanctioned", "financing the tuition fees, accommodation and living costs for the whole of a four-year degree in the capital", "comparing the admission scores that each faculty demands in a given year"] },
      exA: { ok: "A mother employed in a hospital who knows which health courses lead directly to posts.", d: ["The general advice on money and careers that older generations offer the young.", "A university open day at which prospective students tour every faculty.", "The careers service that most universities provide for their final-year undergraduates each spring."] },
      nuanceA: { ok: "a parent's understanding of the labour market may be a generation out of date", d: ["parents generally know far more about employment than their adolescent children do", "a degree in medicine takes considerably longer to complete than most other degrees", "disputes about money between parents and children intensify in the final school year"] },
      facetB: { ok: "The intrinsic motivation that comes from pursuing a self-chosen discipline.", d: ["The accumulated knowledge of employment that older relatives possess.", "The freedom of adults to settle wherever they wish after graduating.", "The growing popularity of new disciplines such as game design and data science."] },
      mechB: { ok: "supplying a personal reason to persevere when the course becomes demanding", d: ["enrolling on engineering independently and persisting through a gruelling first year", "permitting students to leave the family home at the age of eighteen", "obliging universities to admit every applicant to the course of her choice"] },
      exB: { ok: "A student who chose engineering herself and persevered through a gruelling first year.", d: ["Young people throughout the world who aspire to follow their dreams.", "A university that allows first-year students to sample three disciplines before declaring one.", "A school that invites parents to describe their professions to students each term."] },
      nuanceB: { ok: "an adolescent may select a course to stay with her friends rather than because it suits her", d: ["students who choose for themselves invariably graduate with the highest classifications in their cohort", "a number of universities now offer degree programmes taught entirely in English", "parents who finance a degree frequently expect gratitude in return"] },
      position: { ok: "young people should make the final decision, but only after a candid discussion with their parents about employment", d: ["parents should invariably choose the discipline, since adolescents lack the maturity and the knowledge to decide wisely", "universities should allocate each applicant a discipline on the basis of her school results", "both perspectives have merit, and the answer depends on the individual family"] },
      rationale: { ok: "a student who owns a decision is more committed to making it succeed", d: ["parents contribute experience while students contribute motivation, so both views deserve respect", "university is the decisive stage in the life of every young person", "a good degree inevitably leads to well-paid employment in the end"] } },
    B2: {
      core: { ok: "The right to choose what a young person studies at university.", d: ["The influence of parents on every part of a teenager's life.", "The rising cost of a university degree for ordinary families.", "The pressure that entrance exams put on secondary school students."] },
      facetA: { ok: "The experience that parents bring to choices about study and work.", d: ["The motivation that students feel when they choose their own course.", "The money that parents spend on private tuition before university.", "The wish of many parents to see their child become a doctor."] },
      mechA: { ok: "using what parents have seen of the job market to steer a child towards courses that lead to work", d: ["forbidding a child to apply for any course that her parents have not approved", "paying the fees, the rent and the living costs for the whole of a four-year degree at a city university", "comparing the entrance scores that each faculty asks for in a given year"] },
      exA: { ok: "A mother who works in a hospital and knows which health courses lead straight to jobs.", d: ["The general advice about money, marriage and careers that older people like to give the young.", "A university open day where students can visit every faculty.", "The careers office that most universities run for their final-year students."] },
      nuanceA: { ok: "parents' picture of the job market may be twenty years out of date", d: ["parents usually know far more about work than their teenage children do", "a degree in medicine takes longer to finish than a degree in most other subjects", "parents and children often argue about money in the final year of school"] },
      facetB: { ok: "The motivation that comes from studying a subject one has chosen.", d: ["The knowledge of the job market that older relatives have gained.", "The freedom of adults to live wherever they wish after graduation.", "The popularity of new courses such as game design and data science."] },
      mechB: { ok: "giving students a personal reason to keep working when a course becomes difficult", d: ["choosing engineering alone and then staying on the course through a hard and lonely first year", "allowing students to move out of the family home at the age of eighteen", "making universities accept every student who applies for a course"] },
      exB: { ok: "A student who chose engineering herself and kept going through a hard first year.", d: ["Young people all over the world who want to follow their dreams.", "A university that lets first-year students try three subjects before they choose one.", "A school that invites parents to talk about their jobs to students every term."] },
      nuanceB: { ok: "a seventeen-year-old may pick a course because her friends chose it, not because it suits her", d: ["students who choose for themselves always finish their degrees with the highest marks in the class", "some universities now offer whole degree programmes taught in English", "parents who pay for a degree often expect to be thanked for it"] },
      position: { ok: "young people should make the final choice, but only after a serious talk with their parents about jobs", d: ["parents should always choose the subject, because a teenager is too young to decide", "universities should choose the right subject for each student from her school marks and a short interview", "both sides have good points, and the answer depends on each family"] },
      rationale: { ok: "a student who owns a decision works harder to make it succeed", d: ["parents have experience and students have motivation, so both views are important", "university is the most important stage in the life of any young person", "a good degree always leads to a well-paid job in the end"] } } },
    modelId: ""
  });

  /* -------------------------------------------------- 102 OPINION (mock 2) */
  M.push({
    id: "p-mock-star-pay", n: 102, type: "OPINION", domain: "work", level: 'B2', schema: "individual-collective", title: "Stars' pay and key workers", mock: true,
    text: "Top sports players and entertainers often earn far more than doctors, nurses and teachers. Some people say this is unfair, because the work of these professionals is more valuable to society. To what extent do you agree or disagree?",
    keyNouns: ["sport", "teacher", "earn", "societ"],
    vars: { C1: {
      core: { ok: "The disparity between the earnings of sporting celebrities and those of essential professionals.", d: ["The unequal distribution of wealth and income between affluent and impoverished citizens across the globe.", "The escalating price of admission to football matches and concerts.", "The working conditions of nurses employed in public hospitals."] },
      facetA: { ok: "The superior social value of health care and education.", d: ["The vast audiences prepared to pay to watch elite players and performers.", "The proportion of celebrated athletes who were raised in poverty.", "The effect of celebrity endorsements on young people's clothing choices."] },
      mechA: { ok: "sustaining life and equipping every child for adulthood, functions without which no society can operate", d: ["compelling every football club and film studio to cap the pay of its stars at the salary of a head teacher", "undergoing years of medical training before receiving a full salary", "endorsing sports drinks on television and across social media"] },
      exA: { ok: "Nurses who worked additional shifts in overcrowded hospitals during the pandemic.", d: ["The countless important occupations that ordinary citizens perform daily.", "A young footballer who signs a lucrative five-year contract with a celebrated club abroad.", "A singer whose concert tickets sell out within minutes of release."] },
      nuanceA: { ok: "social value resists precise measurement and cannot determine an exact salary", d: ["doctors and teachers perform work of far greater consequence than any football match", "many nurses emigrate in search of higher salaries abroad", "teachers in many countries also enjoy lengthy summer holidays"] },
      facetB: { ok: "The voluntary spending of fans, rather than taxpayers, on star performers.", d: ["The inadequate salaries that deter many young people from entering nursing.", "The private lives of celebrities and their families.", "The achievements of Thai athletes in international competition."] },
      mechB: { ok: "generating revenue from tickets, streaming and sponsorship that consumers buy freely, not from public funds", d: ["filling a football stadium every week and selling thousands of replica shirts to supporters on several continents", "paying a higher rate of income tax than almost any other citizen", "donating a share of their earnings to children's charities"] },
      exB: { ok: "A football club that fills its stadium and sells its shirts on several continents.", d: ["Wealthy individuals residing in large houses in every major city.", "A provincial hospital forced to close a paediatric ward for want of qualified nursing staff.", "A government that raises taxation to finance new schools."] },
      nuanceB: { ok: "a market that rewards a singer above a surgeon gives the young a distorted sense of what matters", d: ["fans are entirely free to spend their own money as they wish, so the disparity involves no unfairness whatsoever", "certain celebrated players earn more from endorsements than from competition", "concert tickets have become unaffordable for many students"] },
      position: { ok: "I largely agree: the disparity is unjust, but the remedy is to raise professionals' pay, not to cut stars' pay", d: ["I agree entirely, so governments should legislate to reduce every celebrity's income to that of a senior hospital doctor", "I disagree, since stars work every bit as hard as doctors and teachers", "I partly agree and partly disagree with this statement"] },
      rationale: { ok: "pay should reflect the work on which a society depends, not merely the attention an individual attracts", d: ["stars are paid generously by their fans whereas nurses and teachers are paid poorly by the state that employs them", "every individual should be free to earn as much as the market allows", "financial reward matters less than personal fulfilment in any occupation"] } },
    B2: {
      core: { ok: "The gap between the earnings of sports stars and those of key professionals.", d: ["The unequal spread of wealth and income between rich and poor people across the world.", "The rising cost of tickets for football matches and concerts.", "The working conditions of nurses in public hospitals."] },
      facetA: { ok: "The greater value of health care and education to society.", d: ["The huge audiences who pay to watch the best players and performers.", "The number of famous players who grew up in poor families.", "The effect of celebrity adverts on the clothes young people choose."] },
      mechA: { ok: "keeping people alive and preparing every child for adult life, work that no society can do without", d: ["forcing every football club and film studio to pay its biggest stars no more than a head teacher earns", "training for many years at medical school before earning a full salary", "appearing on television and social media to advertise sports drinks"] },
      exA: { ok: "Nurses who worked extra shifts in crowded hospitals during the pandemic.", d: ["The many important jobs that ordinary people do every day.", "A young footballer who signs a new contract with a famous club in another country.", "A singer whose concert tickets sell out within a few minutes."] },
      nuanceA: { ok: "the value of a job to society is hard to measure and cannot set an exact salary", d: ["doctors and teachers do work that matters far more to ordinary families than any football match", "many nurses leave their jobs to work abroad for higher pay", "teachers in many countries also have long summer holidays"] },
      facetB: { ok: "The money that fans, not taxpayers, choose to spend on stars.", d: ["The low salaries that keep many young people out of nursing.", "The private lives of famous people and their families.", "The success of Thai sports players in international competitions."] },
      mechB: { ok: "earning from tickets, streams and sponsorship that people buy freely rather than from public money", d: ["selling out a football stadium every week and selling thousands of shirts to fans in other countries", "paying higher income tax than almost anyone else in the country", "giving part of their earnings to charities for poor children"] },
      exB: { ok: "A football club that fills its stadium and sells its shirts in many countries.", d: ["Rich people who live in large houses in every big city.", "A hospital that has to close a children's ward because it cannot find enough nurses.", "A government that raises taxes to pay for new schools."] },
      nuanceB: { ok: "a market that pays a singer more than a surgeon still teaches the young the wrong lesson", d: ["fans are free to spend their own money, so there is nothing unfair about the gap at all", "some famous players earn more from adverts than from playing", "concert tickets have become too expensive for many students"] },
      position: { ok: "I largely agree: the gap is unfair, but the answer is better pay for professionals, not lower pay for stars", d: ["I completely agree, so the government should pass a law that cuts every star's income to the level of a doctor's", "I disagree, because stars work just as hard as doctors and teachers", "I partly agree and partly disagree with this statement"] },
      rationale: { ok: "pay should reward the work a society depends on, not only the attention a person attracts", d: ["stars earn a great deal from fans while nurses and teachers earn far too little from the state", "everyone should be free to earn as much money as they can", "money is less important than happiness in any job"] } } },
    modelId: ""
  });

  /* -------------------------------------------------- 103 PROBLEM (mock 3) */
  M.push({
    id: "p-mock-food-waste", n: 103, type: "PROBLEM", domain: "environment", level: 'B2', schema: "prevention-cure", title: "Food thrown away", mock: true,
    text: "In many countries, shops, restaurants and households throw away large amounts of food that is still safe to eat, while some families cannot afford a proper meal. What are the causes of this problem? What measures could be taken to solve it?",
    keyNouns: ["food", "wast", "shop", "famil"],
    vars: { C1: {
      core: { ok: "The waste of edible food by shops, restaurants and households.", d: ["The persistence of hunger and poverty across the developing world.", "The escalating price of staple foods in local markets.", "The health risks of consuming food beyond its expiry date."] },
      facetA: { ok: "The practice among supermarkets and restaurants of over-supplying to avoid empty displays.", d: ["The fresh trays that hotel buffets continue to replenish until the very final hour of service.", "The popularity of dining out among young urban professionals.", "The prohibitive cost of renting retail premises in central districts."] },
      mechA: { ok: "keeping shelves and buffets permanently full for appearance, then discarding the surplus at closing time", d: ["replenishing the trays at a hotel buffet until the final hour of service, whatever the number of guests remaining", "offering discounts to customers who purchase in bulk", "training kitchen staff to prepare a wider repertoire of dishes"] },
      exA: { ok: "Hotel buffets that replenish their trays until the final hour of service.", d: ["The numerous restaurants and food outlets found in every major city.", "Street food stalls that cook each dish only once a customer has ordered it.", "Farmers' markets at which produce is sold directly to the consumer."] },
      nuanceA: { ok: "a further cause is that households discard edible food when they confuse best-before with use-by dates", d: ["a further cause is that supermarkets and restaurants routinely prepare more food than customers will purchase", "a further consequence is that decomposing food releases methane once it reaches landfill", "a further cause is that rents for retail premises are far higher in central districts than in the suburbs"] },
      facetB: { ok: "Legislation or tax incentives obliging large food sellers to donate unsold stock.", d: ["Campaigns encouraging children to finish everything on their plates.", "The construction of additional landfill sites and incinerators beyond the city limits.", "Free cookery courses for adults held in community centres."] },
      mechB: { ok: "redirecting tonight's surplus into tomorrow's meals for families in need", d: ["collecting bread and fruit from supermarket shelves every evening", "incinerating food waste to generate electricity for neighbouring homes", "restricting the number of dishes that each restaurant and hotel buffet may serve daily"] },
      exB: { ok: "The French law of 2016 requiring large supermarkets to donate unsold food to charities.", d: ["Charities that assist disadvantaged families in a variety of ways.", "Buffet restaurants that surcharge customers for any food left uneaten on the plate.", "Supermarkets that sell fruit and vegetables in plastic packaging."] },
      nuanceB: { ok: "donation rescues only what reaches the shop, so clearer date labels are needed as a second measure for households", d: ["donation alone will eliminate food waste in every country within a few years", "food banks in most countries are run by charities and unpaid volunteers rather than by central or local government", "decomposing food in landfill contributes to climate change"] },
      position: { ok: "governments must first oblige large food sellers to donate their surplus, and then help households interpret date labels", d: ["governments should construct additional landfill sites and incinerators so that waste no longer accumulates in the streets", "every household should cultivate its own vegetables", "food waste is an unavoidable feature of modern life that must simply be accepted"] },
      rationale: { ok: "food that already exists should nourish people before it fills a bin", d: ["retailers and households both waste food, so both must change their behaviour", "feeding hungry families is the responsibility of charities rather than retailers", "cheap food invariably serves poor families better than healthy food"] } },
    B2: {
      core: { ok: "The waste of safe food by shops, restaurants and homes.", d: ["The problem of hunger and poverty in every part of the world.", "The rising price of rice and vegetables in local markets.", "The health risks of eating food after its expiry date."] },
      facetA: { ok: "The habit of shops and restaurants of preparing more food than customers buy.", d: ["The fresh trays that hotel buffets keep putting out until the very last hour of service.", "The popularity of eating out among young office workers.", "The high cost of renting a shop in a busy city centre."] },
      mechA: { ok: "filling shelves and buffets so they never look empty, then throwing out what is left at closing time", d: ["putting out fresh trays at a hotel buffet until the last hour of service", "selling food at much lower prices to customers who buy in large amounts for parties and family events", "training kitchen staff to cook a wider range of dishes"] },
      exA: { ok: "Hotel buffets that put out fresh trays of food until the last hour of service.", d: ["The many restaurants and food shops found in every large city.", "Street food stalls that cook each dish only when a customer orders it.", "Farmers' markets where people can buy fruit and vegetables straight from the farm."] },
      nuanceA: { ok: "a second cause is that households throw away good food when they confuse best-before and use-by dates", d: ["a second cause is that shops and restaurants prepare far more food than their customers will ever buy", "a second effect is that food waste produces methane when it rots in landfill sites", "a second cause is that shop rents are much higher in the city centre than in the suburbs"] },
      facetB: { ok: "Laws or tax breaks that make large food sellers give unsold food away.", d: ["Campaigns that teach children at school to finish everything on their plates.", "The building of new landfill sites outside the city.", "Free cooking classes for adults in community centres."] },
      mechB: { ok: "turning tonight's unsold food into tomorrow's meals for families who need them", d: ["collecting bread and fruit from supermarket shelves every evening", "burning food waste to produce electricity for nearby homes", "reducing the number of dishes that each restaurant and hotel buffet may serve in a day"] },
      exB: { ok: "The French law of 2016 that makes large supermarkets give unsold food to charities.", d: ["Charities that help poor families in many different ways.", "Buffet restaurants that charge customers extra for any food left on the plate.", "Supermarkets that sell fruit and vegetables in plastic packaging."] },
      nuanceB: { ok: "donation saves only food that reaches a shop, so clearer date labels are needed as a second measure for homes", d: ["donation alone will end food waste in every country within a few years", "food banks in most countries are run by charities and unpaid volunteers rather than by national or local governments", "rotting food in landfill sites adds to climate change"] },
      position: { ok: "governments must first make large food sellers donate unsold food, and then help families read date labels", d: ["governments should build more landfill sites and incinerators so that rotting waste does not fill the streets", "every family should grow its own vegetables at home", "food waste is a problem that people simply have to accept"] },
      rationale: { ok: "food that already exists should feed people before it fills a bin", d: ["shops and families both waste food, so both of them need to change", "hungry families are the job of charities, not of shops", "cheap food is always better for poor families than healthy food"] } } },
    modelId: ""
  });

  /* ---------------------------------------------- the registry (Prompts.get)
     writer.js builds window.Prompts with get(id) reading CONTENT.PROMPTS only.
     Extend get() so a mock prompt resolves everywhere a report or a mock is
     shown, and add isMock(id). all() is left alone: it is the practice bank. */
  function mockGet(id) { for (var i = 0; i < M.length; i++) if (M[i].id === id) return M[i]; return null; }
  function hook() {
    var PR = window.Prompts;
    if (!PR || PR._mockHook) return !!PR;
    var base = PR.get;
    PR.get = function (id) { return (base ? base.call(PR, id) : null) || mockGet(id); };
    PR.isMock = function (id) { return !!mockGet(id); };
    PR.mocks = function () { return M; };
    PR._mockHook = true;
    return true;
  }
  if (!hook() && typeof document !== 'undefined' && document.addEventListener) document.addEventListener('DOMContentLoaded', hook);
})();
