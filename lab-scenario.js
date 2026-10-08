/* ===========================================================================
   POSITION CONTROL — lab-scenario.js
   The Test Drive scenario for the Blueprint Studio: the Bangkok floods of
   September–October 2026, five original prompts (one per question type) and
   the eleven variables for each at Band 6, 7 and 8.

   While a student writes her template lines, the Studio drops each line into
   one of these essays so she can see her own frame carrying real ideas. The
   variables are the ideas; the frame is always hers.

   Shapes. A frame decides the grammar of the slot that follows it ("works by"
   needs an -ing phrase, "because" needs a clause, "A clear example is" needs a
   noun phrase). Mechanisms are therefore given as { ing, clause } and examples
   as { np, clause }; lab.js reads the words before the slot and picks the
   shape that fits. Keys ending in 2 are the reworded second mention.

   Playbook meaning (as template.js PLAYBOOKS):
     OPINION    facetA / facetB = two reasons · position = the stance
     ADVANTAGE  facetA = main advantage · facetB = main disadvantage
     PROBLEM    facetA = main cause · nuanceA = second cause · facetB = the
                solution · nuanceB = its limit + the residents' part
     TWOPART    facetA = answer to Q1 · facetB = answer to Q2
   Facts are from news reports listed in SOURCES; every prompt is original.
   Plain ES5.
   =========================================================================== */
(function (global) {
  'use strict';

  var S = {
    id: 'bkk-floods-2026',
    title: 'Bangkok floods, September 2026',
    blurb: 'Nearly 300 mm of rain in two days, all 50 districts declared disaster zones, schools closed and phones buzzing with flood alerts.',
    order: ['DISCUSS', 'OPINION', 'ADVANTAGE', 'PROBLEM', 'TWOPART'],
    /* Blueprint level → which band of ideas the test drive uses. */
    bandFor: { B1: 6, B2: 7, C1: 8, C2: 8 },
    bands: [
      { band: 6, name: 'Band 6', cefr: 'B1' },
      { band: 7, name: 'Band 7', cefr: 'B2' },
      { band: 8, name: 'Band 8', cefr: 'C1' }
    ],
    sources: [
      { name: 'AP (26 Sept 2026)', url: 'https://abcnews.com/International/wireStory/heavy-rain-flooding-bangkok-disrupts-traffic-prompts-evacuations-136775006' },
      { name: 'The Star (26 Sept 2026)', url: 'https://www.thestar.com.my/aseanplus/aseanplus-news/2026/09/26/all-50-bangkok-districts-declared-disaster-zones-as-flooding-worsens-canals-full-and-roads-submerged' },
      { name: 'Khaosod English (26 Sept 2026)', url: 'https://www.khaosodenglish.com/news/2026/09/26/closed-schools-and-work-from-home-on-monday-as-bangkok-battles-floods/' },
      { name: 'The Nation (28 Sept 2026)', url: 'https://www.nationthailand.com/news/40071611' },
      { name: 'The Nation (2 Oct 2026)', url: 'https://www.nationthailand.com/news/40071792' }
    ],
    prompts: {}
  };

  /* ------------------------------------------------------------ OPINION */
  S.prompts.OPINION = {
    title: 'Who protects homes from floods?',
    text: 'Some people say that protecting homes from floods is mainly the job of the people who live in them, not the government. To what extent do you agree or disagree?',
    sets: {
      6: {
        core: 'protecting homes from floods', core2: 'who should protect homes from floods',
        facetA: 'the size of the flood problem', facetA2: 'the size of a city flood',
        facetB: 'the cost of protection for poor families', facetB2: 'the high cost of flood protection',
        mechA: { ing: 'letting floodwater move from house to house, so one family cannot stop it with sandbags or a small wall',
                 clause: 'floodwater does not stop at one house, so one family cannot control it with sandbags or a small wall' },
        exA: { np: 'the Bangkok floods in September 2026, when all 50 districts became disaster zones and even the city\'s canals were full',
               clause: 'all 50 districts of Bangkok became disaster zones in September 2026 and even the city\'s canals were full' },
        nuanceA: 'families can still do small things, such as keeping the drains near their home clean',
        mechB: { ing: 'making poor families pay for flood walls, water pumps and higher floors, even though many of them live in low areas near canals',
                 clause: 'flood walls, water pumps and higher floors are very expensive, and many poor families live in low areas near canals' },
        exB: { np: 'the more than 200 shelters that Bangkok opened for families who could not protect their own homes',
               clause: 'Bangkok opened more than 200 shelters for families who could not protect their own homes' },
        nuanceB: 'some people say that government help makes people careless about where they build, but clear building rules can solve this problem',
        position: 'the government, not each family, should be mainly responsible for protecting homes from floods',
        position2: 'the government must lead flood protection, and families can only help',
        rationale: 'a problem that is bigger than one family needs a solution from the whole city'
      },
      7: {
        core: 'responsibility for protecting homes from floods', core2: 'the duty to protect homes from floods',
        facetA: 'the shared nature of urban flooding', facetA2: 'the shared character of flood risk',
        facetB: 'the unequal ability of families to pay for protection', facetB2: 'this unequal ability to pay',
        mechA: { ing: 'spreading water across whole districts through shared canals and drains, which means that sandbags around one house simply push the water towards the next one',
                 clause: 'floodwater spreads across whole districts through shared canals and drains, which means that sandbags around one house simply push the water towards the next one' },
        exA: { np: 'Bangkok in late September 2026, when the canals were full and all fifty districts were declared disaster zones',
               clause: 'Bangkok\'s canals were full in late September 2026 and all fifty districts were declared disaster zones' },
        nuanceA: 'households can still reduce damage by keeping nearby drains clear and moving valuables upstairs',
        mechB: { ing: 'placing the heaviest burden on families in low-lying canal-side communities, who are usually the least able to afford raised floors or pumps',
                 clause: 'the families most exposed to floods, often in low-lying canal-side communities, are usually the least able to afford raised floors or pumps' },
        exB: { np: 'the city\'s decision to open over 200 temporary shelters for residents who could not protect their homes',
               clause: 'the city had to open over 200 temporary shelters for residents who could not protect their homes' },
        nuanceB: 'state support encourages people to build in risky areas, but that argues for stricter planning rules, not for leaving families to cope alone',
        position: 'this responsibility belongs mainly to the government rather than to individual households',
        position2: 'the government must lead on flood protection, while residents play a smaller, practical part',
        rationale: 'a risk no single household creates or controls has to be managed by the community as a whole'
      },
      8: {
        core: 'whether homeowners should bear the main responsibility for flood protection', core2: 'the allocation of responsibility for flood protection',
        facetA: 'the collective nature of urban flood risk', facetA2: 'the shared character of flood risk',
        facetB: 'the inequality that a household-based approach would entrench', facetB2: 'the inequality such an approach would entrench',
        mechA: { ing: 'channelling rainwater through canals and pumping stations shared by entire districts, so that one family\'s sandbags merely divert the flow onto a neighbour\'s property',
                 clause: 'rainwater moves through canals and pumping stations shared by entire districts, so one family\'s sandbags merely divert the flow onto a neighbour\'s property' },
        exA: { np: 'Bangkok in late September 2026, when nearly 300 millimetres in two days left the canals full and all fifty districts declared disaster zones',
               clause: 'nearly 300 millimetres of rain in two days left Bangkok\'s canals full and all fifty districts declared disaster zones in late September 2026' },
        nuanceA: 'residents can limit damage by clearing drains and moving belongings upstairs',
        mechB: { ing: 'concentrating risk on low-income families in low-lying canal-side communities, who are the least able to afford raised floors, barriers or relocation',
                 clause: 'such an approach concentrates risk on low-income families in low-lying canal-side communities, who are the least able to afford raised floors, barriers or relocation' },
        exB: { np: 'the more than two hundred temporary shelters the city had to open for residents who could not protect their own homes',
               clause: 'the city had to open more than two hundred temporary shelters for residents who could not protect their own homes' },
        nuanceB: 'public protection encourages construction in hazardous areas, yet rarely does this justify anything more than stricter zoning',
        position: 'homeowners should not carry this burden: flood protection is primarily a public duty, in which households play only a supporting role',
        position2: 'governments must lead on flood defence, with households in a secondary role',
        rationale: 'a risk generated and spread by a shared system can only be managed by the authority that controls that system'
      }
    }
  };

  /* ------------------------------------------------------------ DISCUSS */
  S.prompts.DISCUSS = {
    title: 'Tunnels or green space?',
    text: 'Some people believe the best way for cities to deal with floods is to build large engineering projects, such as drainage tunnels and floodwalls. Others think cities should leave more space for nature, such as parks and wetlands, to hold rainwater. Discuss both views and give your own opinion.',
    sets: {
      6: {
        core: 'the best way to stop floods in cities', core2: 'how cities should deal with floods',
        facetA: 'big engineering projects such as tunnels and floodwalls', facetA2: 'tunnels and floodwalls',
        facetB: 'space for nature, such as parks and wetlands', facetB2: 'parks and wetlands',
        mechA: { ing: 'moving a lot of water out of the city quickly, so roads become dry sooner',
                 clause: 'tunnels move a lot of water out of the city quickly, so roads become dry sooner' },
        exA: { np: 'Bangkok, where the governor said in September 2026 that the city needs more drainage tunnels',
               clause: 'the governor of Bangkok said in September 2026 that the city needs more drainage tunnels' },
        nuanceA: 'these projects cost a lot of money and take many years to build',
        mechB: { ing: 'letting grass and soil soak up rain, so less water goes into the drains at the same time',
                 clause: 'grass and soil can soak up rain, so less water goes into the drains at the same time' },
        exB: { np: 'Chulalongkorn University Centenary Park in Bangkok, which was designed to collect rainwater',
               clause: 'Chulalongkorn University Centenary Park in Bangkok was designed to collect rainwater' },
        nuanceB: 'there is not much free land in a big city, and one park cannot protect a whole district',
        position: 'cities need big engineering projects, but they should also build more parks to hold rainwater',
        position2: 'cities should use both methods, with tunnels doing the main job',
        rationale: 'using two methods together is safer than using only one'
      },
      7: {
        core: 'how cities should protect themselves from floods', core2: 'urban flood defence',
        facetA: 'the speed and capacity of large engineering projects', facetA2: 'large-scale engineering',
        facetB: 'the natural ability of green spaces to absorb rain', facetB2: 'green space',
        mechA: { ing: 'carrying huge volumes of water under the city and straight into the river, bypassing canals that are already full',
                 clause: 'tunnels carry huge volumes of water under the city and straight into the river, bypassing canals that are already full' },
        exA: { np: 'Bangkok in September 2026, when the governor called for more drainage tunnels after the existing canals overflowed',
               clause: 'the governor of Bangkok called for more drainage tunnels in September 2026 after the existing canals overflowed' },
        nuanceA: 'such projects take years to build and still fail once rainfall goes beyond the level they were designed for',
        mechB: { ing: 'soaking up rain and releasing it slowly, so less water reaches the drains at the same moment',
                 clause: 'soil, grass and wetlands soak up rain and release it slowly, so less water reaches the drains at the same moment' },
        exB: { np: 'Chulalongkorn University Centenary Park in central Bangkok, which was designed to store rainwater',
               clause: 'Chulalongkorn University Centenary Park in central Bangkok was designed to store rainwater' },
        nuanceB: 'land in a crowded capital is scarce and expensive, and no single park can absorb a storm of 300 millimetres',
        position: 'engineering should remain the backbone of flood defence, supported by green space in every district',
        position2: 'tunnels and floodwalls should do the heavy work, while parks and wetlands reduce the load',
        rationale: 'a city that relies on a single line of defence has nothing left when that line is overwhelmed'
      },
      8: {
        core: 'the most effective approach to urban flood defence', core2: 'urban flood defence',
        facetA: 'the capacity of large-scale engineering', facetA2: 'engineered capacity',
        facetB: 'the absorptive role of green infrastructure', facetB2: 'green infrastructure',
        mechA: { ing: 'diverting floodwater through deep tunnels straight into the Chao Phraya River, bypassing canals that have already reached capacity',
                 clause: 'deep tunnels divert floodwater straight into the Chao Phraya River, bypassing canals that have already reached capacity' },
        exA: { np: 'Bangkok\'s response to the September 2026 floods, when the governor identified an expanded tunnel network as the key to coping with future extreme rainfall',
               clause: 'the governor identified an expanded tunnel network as the key to coping with future extreme rainfall after the September 2026 floods' },
        nuanceA: 'such schemes take years and vast budgets to complete, and they fail abruptly once rainfall exceeds their design capacity',
        mechB: { ing: 'slowing the movement of water, as soil and vegetation absorb rainfall and release it gradually, reducing the peak volume that reaches the drains',
                 clause: 'soil and vegetation absorb rainfall and release it gradually, reducing the peak volume that reaches the drains' },
        exB: { np: 'Chulalongkorn University Centenary Park, a sloping green space in central Bangkok designed to capture and store rainwater',
               clause: 'Chulalongkorn University Centenary Park, a sloping green space in central Bangkok, was designed to capture and store rainwater' },
        nuanceB: 'land in a dense capital is scarce, and no park, however well designed, could absorb 300 millimetres of rain in two days',
        position: 'engineering should remain the backbone of flood defence, but its effectiveness depends on green space reducing the load it must carry',
        position2: 'tunnels and floodwalls should handle extreme events while green infrastructure keeps everyday rainfall from overwhelming them',
        rationale: 'a defence system with a single point of failure offers no protection once that point is breached'
      }
    }
  };

  /* ---------------------------------------------------------- ADVANTAGE */
  S.prompts.ADVANTAGE = {
    title: 'Online lessons when floods close schools',
    text: 'When floods block the roads, many schools now close their buildings and move lessons online for a few days. Do the advantages of this outweigh the disadvantages?',
    sets: {
      6: {
        core: 'moving school lessons online when floods block the roads', core2: 'moving lessons online during floods',
        facetA: 'keeping students and teachers safe', facetA2: 'student safety',
        facetB: 'lower quality learning for some students', facetB2: 'weaker learning at home',
        mechA: { ing: 'keeping students away from deep water, which can be very dangerous, and taking cars off the flooded roads',
                 clause: 'students do not need to travel through deep water, which can be very dangerous, and there are fewer cars on the flooded roads' },
        exA: { np: 'Bangkok in September 2026, when city-run schools closed for a day to reduce traffic on the flooded roads',
               clause: 'city-run schools in Bangkok closed for a day in September 2026 to reduce traffic on the flooded roads' },
        nuanceA: 'some students do not have a computer or good internet at home',
        mechB: { ing: 'making it harder for students to focus at home and for teachers to check that everyone understands',
                 clause: 'it is harder for students to focus at home, and teachers cannot easily check that everyone understands' },
        exB: { np: 'the Covid-19 school closures, when many Thai students fell behind in their studies',
               clause: 'many Thai students fell behind in their studies during the Covid-19 school closures' },
        nuanceB: 'flood closures usually last only a few days, so students can catch up quickly',
        position: 'the advantages of online lessons during floods are bigger than the disadvantages',
        position2: 'the benefits are greater than the problems, especially when the closure is short',
        rationale: 'a few days of weaker lessons can be fixed later, but an accident on a flooded road cannot'
      },
      7: {
        core: 'moving lessons online when floods close schools', core2: 'temporary online learning during floods',
        facetA: 'the protection of students and staff from dangerous journeys', facetA2: 'safer school days',
        facetB: 'a drop in learning quality, especially for poorer students', facetB2: 'weaker learning for poorer students',
        mechA: { ing: 'keeping thousands of people off flooded roads, which reduces the risk of accidents and leaves space for emergency vehicles',
                 clause: 'closures keep thousands of people off flooded roads, which reduces the risk of accidents and leaves space for emergency vehicles' },
        exA: { np: 'Bangkok on 28 September 2026, when city-run schools closed so that fewer vehicles would be on the roads',
               clause: 'city-run schools in Bangkok closed on 28 September 2026 so that fewer vehicles would be on the roads' },
        nuanceA: 'online lessons only work for students with a reliable device and internet connection, which floods can cut off',
        mechB: { ing: 'leaving students at home, where they are easily distracted and teachers cannot see who has stopped following the lesson',
                 clause: 'students learning at home are easily distracted, while teachers cannot see who has stopped following the lesson' },
        exB: { np: 'the long Covid-19 school closures, when many Thai students without a laptop fell behind',
               clause: 'many Thai students without a laptop fell behind during the long Covid-19 school closures' },
        nuanceB: 'flood closures normally last days rather than months, so missed work can be recovered',
        position: 'the advantages clearly outweigh the disadvantages, provided that closures are short and schools support students without devices',
        position2: 'safety comes first, so the benefits prevail while closures stay short and every student has a device',
        rationale: 'lost lessons can be repaid, whereas an injury on a flooded road cannot be undone'
      },
      8: {
        core: 'the temporary shift to online lessons when floods close schools', core2: 'online learning during floods',
        facetA: 'the elimination of hazardous journeys for students and staff', facetA2: 'the removal of dangerous journeys from the school day',
        facetB: 'the widening of existing educational inequalities', facetB2: 'the widening of educational inequality',
        mechA: { ing: 'keeping thousands of pupils, parents and vehicles off submerged roads, which lowers the risk of drowning and electrocution and frees space for rescue services',
                 clause: 'closures keep thousands of pupils, parents and vehicles off submerged roads, which lowers the risk of drowning and electrocution and frees space for rescue services' },
        exA: { np: 'the Bangkok Metropolitan Administration\'s decision to close its schools on 28 September 2026 specifically to reduce traffic on flooded roads',
               clause: 'the Bangkok Metropolitan Administration closed its schools on 28 September 2026 specifically to reduce traffic on flooded roads' },
        nuanceA: 'remote lessons presuppose a working device, electricity and an internet connection, all of which floods can disrupt',
        mechB: { ing: 'concentrating disadvantage, since pupils who share one phone with siblings, or who lack an adult at home, absorb far less than their better-equipped peers',
                 clause: 'remote learning concentrates disadvantage, since pupils who share one phone with siblings, or who lack an adult at home, absorb far less than their better-equipped peers' },
        exB: { np: 'the prolonged Covid-19 closures, during which many Thai pupils without laptops fell noticeably behind',
               clause: 'many Thai pupils without laptops fell noticeably behind during the prolonged Covid-19 closures' },
        nuanceB: 'flood closures last days rather than months, and lessons lost in a week can be recovered through catch-up sessions',
        position: 'the advantages outweigh the disadvantages, provided that closures remain brief and schools support students without reliable access',
        position2: 'the benefits prevail, but only as long as closures stay short and no pupil is left without access',
        rationale: 'missed learning can be repaid, whereas harm suffered on a flooded road is irreversible'
      }
    }
  };

  /* ------------------------------------------------------------ PROBLEM */
  S.prompts.PROBLEM = {
    title: 'Why cities flood, and what to do',
    text: 'Flooding after heavy rain has become a serious problem in many large cities. What are the main causes of this problem, and what can governments and city residents do to solve it?',
    sets: {
      6: {
        core: 'flooding after heavy rain in big cities', core2: 'flooding in cities',
        facetA: 'drains and canals that are too small for today\'s heavy rain', facetA2: 'drains that are too small',
        facetB: 'building bigger drainage systems, such as tunnels and water storage ponds', facetB2: 'building bigger drainage systems',
        mechA: { ing: 'covering the ground with roads and buildings, so rainwater cannot go into the soil and flows into the drains all at once',
                 clause: 'roads and buildings cover the ground, so rainwater cannot go into the soil and all of it flows into the drains at once' },
        exA: { np: 'Bangkok in late September 2026, when almost 300 millimetres of rain fell in two days and the canals were full',
               clause: 'almost 300 millimetres of rain fell on Bangkok in two days in late September 2026 and the canals were full' },
        nuanceA: 'people also throw rubbish into canals and drains, which blocks the water',
        mechB: { ing: 'giving the extra water somewhere to go instead of the roads',
                 clause: 'the extra water has somewhere to go instead of the roads' },
        exB: { np: 'Bangkok\'s plan for a new tunnel to carry canal water to the Nong Bon storage pond',
               clause: 'Bangkok is planning a new tunnel to carry canal water to the Nong Bon storage pond' },
        nuanceB: 'these projects take years, so residents must also stop throwing rubbish into the drains',
        position: 'governments should build bigger drainage systems while residents keep the drains clean',
        position2: 'the government and residents must work together, because each can fix a different cause',
        rationale: 'a drainage system only works well when it is big enough and clean'
      },
      7: {
        core: 'flooding after heavy rain in large cities', core2: 'urban flooding',
        facetA: 'the gap between drainage capacity and today\'s rainfall', facetA2: 'this capacity gap',
        facetB: 'the expansion of drainage capacity through tunnels and retention basins', facetB2: 'greater drainage capacity',
        mechA: { ing: 'sending rain off concrete roads and roofs straight into the canals at once, so that the system overflows within hours',
                 clause: 'rain runs off concrete roads and roofs straight into the canals at once, so that the system overflows within hours' },
        exA: { np: 'Bangkok in late September 2026, when almost 300 millimetres fell in two days and the governor admitted that the canals were full',
               clause: 'almost 300 millimetres fell on Bangkok in two days in late September 2026 and the governor admitted that the canals were full' },
        nuanceA: 'rubbish and illegal buildings narrow many canals, so even the existing capacity is not fully used',
        mechB: { ing: 'giving surplus water a route out of the city or a place to wait until the canals have room again',
                 clause: 'surplus water gets a route out of the city or a place to wait until the canals have room again' },
        exB: { np: 'the city\'s plan for a tunnel linking the Prawet Burirom canal to the Nong Bon retention basin',
               clause: 'Bangkok is preparing a tunnel to link the Prawet Burirom canal to the Nong Bon retention basin' },
        nuanceB: 'such projects take years, so residents must also stop dumping rubbish in drains and act quickly on early warnings',
        position: 'governments should expand drainage capacity, while residents keep the existing system clear',
        position2: 'the state enlarges the drainage system and residents stop blocking it',
        rationale: 'a drainage network can only perform as well as its narrowest point allows'
      },
      8: {
        core: 'flash flooding in major cities', core2: 'urban flooding',
        facetA: 'the mismatch between ageing drainage systems and increasingly intense rainfall', facetA2: 'the gap between ageing drains and heavier rainfall',
        facetB: 'the expansion of underground drainage and storage capacity', facetB2: 'an expanded network of drainage tunnels and retention basins',
        mechA: { ing: 'converting rain into instant runoff, as concrete roads and roofs prevent infiltration and canals receive the entire volume within hours',
                 clause: 'concrete roads and roofs prevent infiltration, converting rain into instant runoff, so canals receive the entire volume within hours and overflow' },
        exA: { np: 'Bangkok in late September 2026, when almost 300 millimetres fell in two days and the governor acknowledged that the canals themselves were full',
               clause: 'almost 300 millimetres fell in two days in late September 2026 and the governor acknowledged that Bangkok\'s canals themselves were full' },
        nuanceA: 'rubbish and encroaching buildings narrow many canals, while decades of land subsidence have left parts of the city barely above sea level',
        mechB: { ing: 'giving surplus water either an exit to the river or a place to wait until the canals regain capacity',
                 clause: 'surplus water gains either an exit to the river or a place to wait until the canals regain capacity' },
        exB: { np: 'the tunnel now being prepared to link the Prawet Burirom canal with the Nong Bon retention basin',
               clause: 'a tunnel is now being prepared to link the Prawet Burirom canal with the Nong Bon retention basin' },
        nuanceB: 'such projects take years, so residents must also stop dumping waste into drains and respond promptly to early warnings',
        position: 'governments must expand drainage capacity, while residents keep the existing network free of waste',
        position2: 'the state enlarges the system while citizens stop obstructing it',
        rationale: 'a drainage network is only as effective as its narrowest point'
      }
    }
  };

  /* ------------------------------------------------------------ TWOPART */
  S.prompts.TWOPART = {
    title: 'Flood alerts on our phones',
    text: 'Many people in flood-prone cities now rely on mobile phone alerts and apps to find out when a flood is coming, rather than on radio, television or their neighbours. Why has this change happened? Is it a positive or a negative development?',
    sets: {
      6: {
        core: 'using mobile phones to get flood warnings', core2: 'flood alerts on mobile phones',
        facetA: 'the speed and convenience of phone alerts', facetA2: 'fast phone alerts',
        facetB: 'the help that early warnings give most families', facetB2: 'the help of early warnings',
        mechA: { ing: 'sending a message in seconds to the phone that almost everyone carries all day, while TV news only comes at certain times',
                 clause: 'almost everyone carries a phone all day, and an alert arrives in seconds, while TV news only comes at certain times' },
        exA: { np: 'the emergency messages that the Thai government sent to people\'s phones in flooded areas in September 2026',
               clause: 'the Thai government sent emergency messages to people\'s phones in flooded areas in September 2026' },
        nuanceA: 'many older people still prefer to hear the news from their neighbours or the radio',
        mechB: { ing: 'giving people time to move their cars and belongings to a higher place',
                 clause: 'people who get a warning early have time to move their cars and belongings to a higher place' },
        exB: { np: 'flood maps on phone apps, which help drivers to avoid flooded roads before they leave home',
               clause: 'flood maps on phone apps help drivers to avoid flooded roads before they leave home' },
        nuanceB: 'people without a smartphone may miss the warning, and the phone network can stop working during a flood',
        position: 'phone alerts are a good change, but they should not completely replace older ways of warning people',
        position2: 'flood alerts on phones are useful, but radio, television and neighbours are still needed',
        rationale: 'a warning system only works fully when it reaches everyone in danger'
      },
      7: {
        core: 'relying on phone alerts for flood warnings', core2: 'phone-based flood warnings',
        facetA: 'the speed and precision of mobile alerts', facetA2: 'fast, targeted alerts',
        facetB: 'the practical benefits of earlier, more targeted warnings', facetB2: 'earlier, better-targeted warnings',
        mechA: { ing: 'sending a warning directly to the phone in a person\'s pocket, and only to the districts at risk, whereas radio and television reach everyone at fixed times',
                 clause: 'an alert goes directly to the phone in a person\'s pocket, and only to the districts at risk, whereas radio and television reach everyone at fixed times' },
        exA: { np: 'the cell-broadcast messages that the Thai government sent to people in flooded areas in late September 2026',
               clause: 'the Thai government used cell-broadcast messages to warn people in flooded areas in late September 2026' },
        nuanceA: 'older residents in particular still trust community leaders and neighbours more than a message on a screen',
        mechB: { ing: 'giving families time to move cars, lift belongings and choose a safer route home',
                 clause: 'an early warning gives families time to move cars, lift belongings and choose a safer route home' },
        exB: { np: 'the Hydro-Informatics Institute\'s online ThaiWater maps, which let residents of thirteen at-risk districts check their area before the rain on 3 and 4 October',
               clause: 'the Hydro-Informatics Institute\'s online ThaiWater maps let residents of thirteen at-risk districts check their area before the rain on 3 and 4 October' },
        nuanceB: 'people without smartphones can miss alerts entirely, and mobile networks are often strained during floods',
        position: 'phone alerts should be welcomed, as long as they add to traditional warnings rather than replace them',
        position2: 'this is a welcome change, provided that radio, television and neighbours remain part of the warning system',
        rationale: 'a warning system should be judged by whether it reaches everyone in danger, not by how fast it reaches most people'
      },
      8: {
        core: 'mobile phone alerts as the main source of flood warnings', core2: 'phone-based flood warnings',
        facetA: 'the immediacy and precision of mobile alerts', facetA2: 'the immediacy of mobile alerts',
        facetB: 'the protective value of earlier, better-targeted warnings', facetB2: 'earlier, better-targeted warnings',
        mechA: { ing: 'delivering warnings within seconds to the device people already carry, and only to the districts at risk, whereas broadcasts reach everyone at scheduled times',
                 clause: 'mobile alerts deliver warnings within seconds to the device people already carry, and only to the districts at risk, whereas broadcasts reach everyone at scheduled times' },
        exA: { np: 'the wave of cell-broadcast messages the Thai government sent to residents of flooded areas in late September 2026',
               clause: 'the Thai government sent a wave of cell-broadcast messages to residents of flooded areas in late September 2026' },
        nuanceA: 'for many older residents, a warning from a neighbour or community leader still carries more authority than a message on a screen',
        mechB: { ing: 'turning minutes of warning into concrete protective action, such as moving vehicles to higher ground, lifting belongings and choosing safer routes',
                 clause: 'early warnings turn minutes into concrete protective action, such as moving vehicles to higher ground, lifting belongings and choosing safer routes' },
        exB: { np: 'the Hydro-Informatics Institute\'s ThaiWater maps, which allowed residents of the thirteen districts flagged for heavy rain on 3 and 4 October to check their own neighbourhood',
               clause: 'the Hydro-Informatics Institute\'s ThaiWater maps allowed residents of the thirteen districts flagged for heavy rain on 3 and 4 October to check their own neighbourhood' },
        nuanceB: 'those without smartphones are excluded entirely, and mobile networks are often strained precisely when floods strike',
        position: 'the change should be welcomed, provided that phone alerts supplement rather than replace traditional channels',
        position2: 'this is a welcome development, as long as radio, television and neighbours remain part of the warning chain',
        rationale: 'a warning system should be measured by whether it reaches everyone in danger'
      }
    }
  };

  global.LabScenario = S;
})(window);
