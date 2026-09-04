window.AGILE_ORBIT_HERO_SCENES = {
  stats: [
    { value: '548+', label: 'Practice Questions' },
    { value: '40', label: 'JQL Examples' },
    { value: '35', label: 'Must-read Books' },
    { value: '20+', label: 'Templates & Tools' }
  ],
  scenes: [
    {
      id:'welcome', tag:'WELCOME TO', title:'AGILE ORBIT', accent:'ORBIT',
      subtitle:'Explore the Agile Universe.', body:'Learn. Think. Practice. Use.',
      cta:'Begin the Journey →', href:'learn/', edge:'PEOPLE · PRACTICES · POSSIBILITIES',
      quote:'Better Teams.<br>A Brighter<br>Tomorrow.', type:'hero',
      image:'assets/hero/01-welcome.webp', position:'center center'
    },
    {
      id:'learn', tag:'LEARN', title:'Build a Stronger Foundation', accent:'Foundation',
      body:'Dive into frameworks, principles, and real-world knowledge to strengthen your Agile mindset.',
      cta:'Start Learning →', href:'learn/', edge:'TIMELESS PRINCIPLES · REAL-WORLD IMPACT',
      type:'cards', image:'assets/hero/02-learn.webp', position:'center center',
      cards:[['Scrum','◔'],['SAFe','▱'],['Kanban','▥'],['Agile Mindset','◎']]
    },
    {
      id:'practice', tag:'PRACTICE', title:'Turn Knowledge into Action', accent:'Action',
      body:'Test yourself with practice questions, real scenarios, and hands-on exercises.',
      cta:'Start Practicing →', href:'practice/', edge:'PRACTICE BUILDS CONFIDENCE',
      type:'astronaut', image:'assets/hero/03-practice.webp', position:'center center'
    },
    {
      id:'tools', tag:'USE', title:'Tools for Everyday Agility', accent:'Everyday Agility',
      body:'Ready-to-use templates, calculators, JQL examples and more to make your work easier.',
      cta:'Explore Tools →', href:'tools/', edge:'PRACTICAL TOOLS · REAL RESULTS',
      type:'cards', image:'assets/hero/04-tools.webp', position:'center center',
      cards:[['Calculators','▦'],['Templates','▤'],['JQL Examples','⌕'],['Retrospectives','♙'],['Assessments','▥'],['Checklists','☑']]
    },
    {
      id:'grow', tag:'BEYOND TOOLING', title:'Grow. Lead. Inspire.', accent:'Inspire.',
      body:'Coaching insights, book recommendations, and resources to help you create lasting impact.',
      cta:'Explore Resources →', href:'resources/', edge:'A MORE HUMAN AGILE WORLD',
      type:'figure', image:'assets/hero/05-resources.webp', position:'center center'
    }
  ],
  closing:{
    tag:'READY TO EXPLORE?', title:'Your Agile Journey Starts Here.', accent:'Starts Here.',
    cta:'Explore the Orbit →', href:'learn/', edge:'SAME UNIVERSE · NEW POSSIBILITIES',
    image:'assets/hero/05-resources.webp', position:'center center'
  }
};
