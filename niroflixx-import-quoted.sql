INSERT INTO "users" ("id","firstName","lastName","username","email","phone","password","role","status","avatar","emailVerified","phoneVerified","lastLogin","createdAt","updatedAt")
              VALUES ('5669c834-2de2-4a92-8b19-5835518a3323','Yves','Testing ','mcrutsboi203','mcrutsboi2023@gmail.com',NULL,'$2a$12$qGFy054KzW.Un11FjIbHk.mCfoh7oQRP7e0fk28wX5caVmP3pAFcy','USER','ACTIVE',NULL,false,false,NULL,'2026-07-05T02:43:41.645Z','2026-07-05T09:52:03.083Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "users" ("id","firstName","lastName","username","email","phone","password","role","status","avatar","emailVerified","phoneVerified","lastLogin","createdAt","updatedAt")
              VALUES ('84d86577-e038-4b02-bf16-536305fb5d28','Mk','Jacq','jac','jacquesmukiza114@gmail.com',NULL,'$2a$12$aKUj4fZheFrX.AmjfwM9CO.lSpY1K.yVKPDUFsKIcrPu3WxmvgCYu','USER','ACTIVE',NULL,false,false,NULL,'2026-07-04T19:47:22.938Z','2026-07-04T19:47:22.938Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "users" ("id","firstName","lastName","username","email","phone","password","role","status","avatar","emailVerified","phoneVerified","lastLogin","createdAt","updatedAt")
              VALUES ('69694d9c-c7bd-4653-812f-60e586301ebd','Eddy','Mushoma','mushoma','honorensabimana99@gmail.com',NULL,'$2a$12$34/a8Y8yNvf1k0UTKeku5e5jf1gNMzohr2Hlxdd0XmzhnQk1s.hDG','USER','ACTIVE',NULL,false,false,NULL,'2026-07-05T16:18:43.247Z','2026-07-05T16:18:43.247Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "users" ("id","firstName","lastName","username","email","phone","password","role","status","avatar","emailVerified","phoneVerified","lastLogin","createdAt","updatedAt")
              VALUES ('33743c66-194d-4275-958c-4f6dd298696a','Check','User','checkUser','agasobanuyenews@gmail.com',NULL,'$2a$12$iMXjp1eqjEBbacOpdgA3VeD0Nvzur7AN4SWdXYcJ.MkG0wgD7AfaC','USER','ACTIVE',NULL,false,false,'2026-07-08T16:22:13.450Z','2026-07-08T15:35:06.298Z','2026-07-08T16:22:13.451Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "users" ("id","firstName","lastName","username","email","phone","password","role","status","avatar","emailVerified","phoneVerified","lastLogin","createdAt","updatedAt")
              VALUES ('0bb50215-7858-40bc-93f7-8114aab0cc01','Niyo','Felix','niyonzima@12','felixniyo4@gmail.com',NULL,'$2a$12$CqQh4hMwV7cna2Ha63GBpu/Flh.LhF8Wr4W90pQ7D/T9560lEdyBS','USER','ACTIVE',NULL,false,false,NULL,'2026-07-05T10:46:42.955Z','2026-07-05T19:41:07.616Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "users" ("id","firstName","lastName","username","email","phone","password","role","status","avatar","emailVerified","phoneVerified","lastLogin","createdAt","updatedAt")
              VALUES ('38c33549-65f3-4341-8892-7e1f50f3fec9','Daniel','NSANZUMUKIZA','Away12','danielnsan43@gmail.com',NULL,'$2a$12$cE0F1QaAGu98p/8/.a4th.AK.OhGlRTPN1fP/CK4j.Yf6qVlXd3WW','USER','ACTIVE',NULL,false,false,NULL,'2026-07-09T09:44:26.352Z','2026-07-09T09:44:26.352Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "users" ("id","firstName","lastName","username","email","phone","password","role","status","avatar","emailVerified","phoneVerified","lastLogin","createdAt","updatedAt")
              VALUES ('37f657e2-f2aa-46f8-acb4-fa19160f472b','Hertier ','Tuyizere ','H','hersink252@gmail.com',NULL,'$2a$12$dFlBbDOHeFED4Jf6vM1ts.UA1HZxVVj6LC8KIwXKLWkmytt7qR5dm','USER','ACTIVE',NULL,false,false,'2026-07-05T19:47:10.459Z','2026-07-05T16:15:43.648Z','2026-07-05T19:47:10.460Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "users" ("id","firstName","lastName","username","email","phone","password","role","status","avatar","emailVerified","phoneVerified","lastLogin","createdAt","updatedAt")
              VALUES ('b6968ee4-b242-4e35-b493-d912291b30db','Niro','Bwimba','nirobwimba','robertniyonkuru001@gmail.com',NULL,'$2a$12$p6YZqLNPJ05jWj.nK4MTxOQ7Jjrws64tuxDH6EnR37NI9iWzT03Ua','SUPER_ADMIN','ACTIVE',NULL,false,false,'2026-07-25T15:56:06.676Z','2026-07-07T16:39:04.293Z','2026-07-25T15:56:06.677Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "users" ("id","firstName","lastName","username","email","phone","password","role","status","avatar","emailVerified","phoneVerified","lastLogin","createdAt","updatedAt")
              VALUES ('87f6564f-f390-4faf-9434-1c772757c1ef','Uba','off','ubalde','ubaldeofficial1@gmail.com',NULL,'$2a$12$AKHbZVj9lwaoGi7ZT8UuSOVV.0etEeDzCTu5QjH4T7zXTmBCTxhLe','CANDIDATE','ACTIVE',NULL,false,false,'2026-07-07T15:04:24.189Z','2026-07-06T15:30:49.702Z','2026-07-07T15:37:17.048Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "courses" ("id","slug","title","subtitle","description","categoryId","level","type","language","price","discount","currency","thumbnail","coverImage","introVideo","duration","capacity","enrollmentCount","status","featured","publishedAt","createdAt","updatedAt")
              VALUES ('4b8e5252-32b7-473d-88ed-4425fe605da4','basic-ict-skills','Basic ICT Skills',NULL,'Learn essential computer skills including MS Office, internet usage, email, and file management. Perfect for beginners who want to become digitally literate.','4dddaba4-4954-424f-93fc-897ef4002938','BEGINNER','ONLINE_LIVE','en','15000','0','RWF','https://res.cloudinary.com/dlxiuwv30/image/upload/v1783242304/niroflixx/zsojrklcidy7lbsmzqhs.jpg',NULL,NULL,'4 Weeks','30','5','PUBLISHED',true,NULL,'2026-07-04T18:21:22.632Z','2026-07-09T10:00:07.689Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "opportunities" ("id","title","organization","country","city","categoryId","type","educationLevel","deadline","description","requirements","benefits","officialLink","contact","featured","views","status","publishedAt","createdAt","updatedAt")
              VALUES ('b3a47b81-88c3-4611-8a98-6bee0ddadd5d','YouthConnekt Awards & ArtsConnekt Competition 2026','Ministry of Youth and Arts — Rwanda','Rwanda','Kigali',NULL,'COMPETITION','All Levels','2026-07-31T00:00:00.000Z','The 2026 YouthConnekt Awards and ArtsConnekt Competitions are now open! The Ministry of Youth and Arts invites young Rwandan innovators and artists with bold visions to apply.

Two categories available:
1. YouthConnekt Awards — For young entrepreneurs and innovators with business projects
2. ArtsConnekt Competition — For artists and creative professionals

Requirements:
- Rwandan citizen
- Business/Project must be registered with RDB (for business category)
- TIN number and bank account (for business category)
- Copy of National ID or Passport

Benefits:
- Funding and grants for your project
- National recognition
- Mentorship and business development support
- Networking opportunities

Apply by July 31, 2026','For Business/Innovation Category:
- RDB registration certificate
- TIN number
- Business bank account
- National ID/Passport
- Brief project description

For Arts Category:
- Portfolio of work
- National ID/Passport
- Project proposal','- Project funding
- National recognition and awards
- Mentorship from industry experts
- Business development support
- Networking with fellow innovators','https://survey123.arcgis.com/share/89edb726d442410d9027fbf5dcc4fd98?portalUrl=https://gh.space.gov.rw/portal',NULL,true,'0','PUBLISHED',NULL,'2026-07-08T09:38:27.531Z','2026-07-08T09:38:27.531Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "opportunities" ("id","title","organization","country","city","categoryId","type","educationLevel","deadline","description","requirements","benefits","officialLink","contact","featured","views","status","publishedAt","createdAt","updatedAt")
              VALUES ('42b12122-1fc7-494a-b939-26bff9e103d5','Hanga Pitchfest 2026 — Win Funding for Your Startup','Hanga Pitchfest / Rwanda Development Board','Rwanda','Kigali',NULL,'COMPETITION','All Levels','2026-08-03T00:00:00.000Z','Hanga Pitchfest 2026 is Rwanda''s premier startup competition organized by the Rwanda Development Board (RDB). If you have a tech-enabled startup with a working prototype, this is your chance to win funding, mentorship, and national recognition.

Eligibility:
- Startup must be based in Rwanda and registered with RDB
- Must be less than 5 years old
- Must have a working prototype/MVP
- Tech-enabled solution with potential to scale

What You Get:
- Funding for your startup
- Mentorship from industry experts
- National exposure and media coverage
- Access to investor networks
- Incubation and acceleration support

Application Deadline: August 3, 2026','- RDB registration certificate
- Pitch deck (template available on website)
- Working prototype/MVP
- Complete online application form','- Startup funding
- Mentorship program
- Investor connections
- National media exposure
- Business development support
- Networking with fellow entrepreneurs',' https://www.hangapitchfest.rw/#/',NULL,true,'0','PUBLISHED',NULL,'2026-07-08T09:28:12.131Z','2026-07-08T11:07:53.134Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "opportunities" ("id","title","organization","country","city","categoryId","type","educationLevel","deadline","description","requirements","benefits","officialLink","contact","featured","views","status","publishedAt","createdAt","updatedAt")
              VALUES ('e8256501-487f-4bd0-9208-ffad21833e76','Brewing Operator Job at Bralirwa','Bralirwa Plantations Ltd (HEINEKEN Group)','Rwanda','Kigali',NULL,'JOB','Bachelor','2026-07-12T00:00:00.000Z','Bralirwa, part of the HEINEKEN Group, is hiring a Brewing Operator in Rwanda.

Job Type: Full-time

The Brewing Operator will be responsible for operating brewing processes safely and efficiently while ensuring product quality, improving operational performance, and minimizing production losses.

Key Responsibilities:
• Apply HEINEKEN safety, food safety, and sustainability standards
• Monitor brewing processes and product quality
• Operate brewing equipment according to procedures
• Maintain documentation and operational reports
• Participate in continuous improvement initiatives

Qualifications:
• Bachelor''s Degree in Chemistry, Biochemistry, Food Science, or related field
• 1–3 years experience in process-driven manufacturing
• Knowledge of TPM, Lean Manufacturing, or Six Sigma
• Fluency in English and Kinyarwanda

Female candidates are strongly encouraged to apply.','• Bachelor''s Degree in Chemistry, Biochemistry, Food Science, or related field
• 1–3 years experience in manufacturing
• English and Kinyarwanda fluency
• Knowledge of continuous improvement methodologies','• Full-time position at a leading beverage manufacturer
• Part of HEINEKEN Group
• Career growth opportunities
• Safety-focused work environment','https://recruitment.mifotra.gov.rw/applicant/advertisements',NULL,true,'0','PUBLISHED',NULL,'2026-07-09T12:29:46.929Z','2026-07-09T12:29:46.929Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "opportunities" ("id","title","organization","country","city","categoryId","type","educationLevel","deadline","description","requirements","benefits","officialLink","contact","featured","views","status","publishedAt","createdAt","updatedAt")
              VALUES ('9d68e17d-e3e6-44ac-a66c-c6a18a0f8f3d','Professional Intern – Data Analytics at Access to Finance Rwanda (AFR)','Access to Finance Rwanda (AFR)','Rwanda','Kigali',NULL,'INTERNSHIP','Bachelor','2026-07-17T00:00:00.000Z','Access to Finance Rwanda (AFR) is hiring a Professional Intern – Data Analytics for a 6-month internship in Kigali.

This is an excellent opportunity for recent graduates to gain practical experience in research, data analytics, project coordination, and knowledge management while contributing to financial inclusion in Rwanda.

Key Responsibilities:
• Support research and market analysis activities
• Clean, analyze, visualize, and report data
• Assist in designing research methodologies and survey instruments
• Prepare reports, presentations, and knowledge products
• Develop dashboards and communication materials
• Participate in data validation and quality assurance

Start Date: 1 August 2026
Duration: 6 Months','• Bachelor''s or Master''s degree in Statistics, Economics, Data Science, Mathematics, or related field
• Strong analytical and quantitative skills
• Knowledge of research methods and survey design
• Proficiency in STATA, SPSS, Python, R, Power BI, or Excel
• Experience with quantitative and qualitative datasets
• Strong report writing and presentation skills
• Rwandan National only
• Female candidates strongly encouraged to apply','• 6-month professional internship
• Practical experience in data analytics
• Work with international partners (Sweden, Mastercard Foundation, Gates Foundation)
• Mentorship from experienced professionals
• Networking in Rwanda''s financial sector
• Monthly stipend (to be confirmed)','https://erp.afr.rw/jobs/apply/professional-intern-data-analytics-79',NULL,true,'0','PUBLISHED',NULL,'2026-07-11T16:46:40.065Z','2026-07-11T16:46:40.065Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "services" ("id","title","slug","description","categoryId","startingPrice","estimatedTime","icon","coverImage","portfolio","faq","status","featured","createdAt","updatedAt")
              VALUES ('51a4c384-fb9f-4deb-a7cf-0ed6909c1ced','Professional CV & Resume Writing','professional-cv-resume-writing-6086','Stand out with a professionally crafted CV tailored to your industry. Includes ATS optimization, modern design, and unlimited revisions. Perfect for job applications, internships, and career changes.',NULL,'5000','1-2 days',NULL,NULL,NULL,NULL,'PUBLISHED',true,'2026-07-04T18:05:46.087Z','2026-07-04T18:05:46.087Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "services" ("id","title","slug","description","categoryId","startingPrice","estimatedTime","icon","coverImage","portfolio","faq","status","featured","createdAt","updatedAt")
              VALUES ('8dfc4a3e-41c7-4c90-8b47-a840cc020e26','Graphic Design & Branding','graphic-design-branding-3565','Professional logos, posters, banners, business cards, and complete brand identity packages. We create designs that make your business stand out.',NULL,'20000','3-5 days',NULL,NULL,NULL,NULL,'PUBLISHED',true,'2026-07-04T18:07:23.566Z','2026-07-04T18:07:23.566Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "services" ("id","title","slug","description","categoryId","startingPrice","estimatedTime","icon","coverImage","portfolio","faq","status","featured","createdAt","updatedAt")
              VALUES ('f6b0d432-40e3-4f18-978b-e3f171887b02','University & Scholarship Application Assistance','university-scholarship-application-assistance-3415','We help you prepare complete application packages for universities and scholarships abroad. Includes document review, motivation letter writing, and application submission guidance.',NULL,'3000','1-7 days',NULL,NULL,NULL,NULL,'PUBLISHED',true,'2026-07-04T18:08:43.415Z','2026-07-04T18:08:43.415Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "services" ("id","title","slug","description","categoryId","startingPrice","estimatedTime","icon","coverImage","portfolio","faq","status","featured","createdAt","updatedAt")
              VALUES ('75c922db-f5b6-49cf-bf66-6cf41b4e0906','Career & Tech Consultation','career-tech-consultation-0048','One-on-one consultation for career guidance, tech project planning, interview preparation, and academic advice. Get expert insights from industry professionals.',NULL,'5000','1 hour session',NULL,NULL,NULL,NULL,'PUBLISHED',true,'2026-07-04T18:09:40.048Z','2026-07-04T18:09:40.048Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "services" ("id","title","slug","description","categoryId","startingPrice","estimatedTime","icon","coverImage","portfolio","faq","status","featured","createdAt","updatedAt")
              VALUES ('b2488ea5-b80d-425d-bc47-cbfc0d785981','Website Development','website-development-3611','Custom responsive websites for businesses, portfolios, and organizations. Built with modern technologies, SEO-optimized, and mobile-friendly. Includes domain setup guidance and 1 month free maintenance.',NULL,'70000','1-2 weeks',NULL,NULL,NULL,NULL,'PUBLISHED',true,'2026-07-04T18:06:33.612Z','2026-07-05T09:40:44.169Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "resources" ("id","title","slug","description","categoryId","type","fileUrl","thumbnail","price","downloadCount","views","rating","author","version","language","status","featured","publishedAt","createdAt","updatedAt")
              VALUES ('48d8431b-d57a-47e0-a095-e13fa01c362a','Top 10 AI Websites You Must Know in 2026','top-10-ai-websites-you-must-know-in-2026-2190','Discover 10 powerful AI websites that can improve your learning, productivity, creativity, and career. Interactive PDF guide covering ChatGPT, Canva AI, GitHub Copilot, Runway ML, Grammarly, Suno AI, Midjourney, Gamma, Perplexity AI, and Niroflixx.',NULL,'PDF','https://res.cloudinary.com/dlxiuwv30/raw/upload/v1783357806/niroflixx/vhog7fpzwzusa5euyceh',NULL,'0','8','0','0',NULL,NULL,'en','PUBLISHED',false,NULL,'2026-07-06T17:10:22.191Z','2026-07-08T16:00:12.057Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "resources" ("id","title","slug","description","categoryId","type","fileUrl","thumbnail","price","downloadCount","views","rating","author","version","language","status","featured","publishedAt","createdAt","updatedAt")
              VALUES ('6435eb65-fb1f-42cf-a227-9f47cae8093a','Top 10 AI Websites You Must Know in 2026','top-10-ai-websites-you-must-know-in-2026-6426','Discover 10 powerful AI websites that can improve your learning, productivity, creativity, and career. Interactive HTML guide.
https://youtu.be/iCCWah-q8vQ',NULL,'PDF','https://res.cloudinary.com/dlxiuwv30/image/upload/v1783346201/niroflixx/gpu5s8ciwlmdyeyo9y8x.pdf',NULL,'0','9','0','0',NULL,NULL,'en','ARCHIVED',false,NULL,'2026-07-06T13:40:56.427Z','2026-07-06T17:06:40.622Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "news" ("id","title","slug","summary","content","coverImage","author","categoryId","status","featured","views","publishedAt","createdAt","updatedAt","seoTitle","seoDescription")
              VALUES ('54dcf4c3-02f4-4010-819e-b8ecad2fa51f','Niroflixx Officially Launches — Your Digital Career Platform','niroflixx-officially-launches-your-digital-career-platform-2898','Niroflixx is now live! A unified platform for learning tech skills, finding opportunities, and accessing professional services in Rwanda and beyond.','We are excited to announce the official launch of Niroflixx — a digital platform designed to help students and professionals learn, grow, and succeed. Whether you''re looking to learn cybersecurity, find a scholarship, get a professional CV, or build a website, Niroflixx has you covered. Our mission is to bridge the gap between education and employment by providing accessible technology training, curated opportunities, and professional services all in one place. Sign up today and start your journey!',NULL,'Niroflixx Team',NULL,'PUBLISHED',true,'0',NULL,'2026-07-04T18:12:12.899Z','2026-07-04T18:12:12.899Z',NULL,NULL)
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "candidates" ("id","userId","headline","summary","currentEducation","currentInstitution","experienceYears","availability","completionScore","status","createdAt","updatedAt")
              VALUES ('baadb497-5e58-4c89-8f34-172c2e8bffef','69694d9c-c7bd-4653-812f-60e586301ebd',NULL,NULL,NULL,NULL,'0',NULL,'0','rejected','2026-07-05T16:26:15.929Z','2026-07-05T19:36:19.509Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "candidates" ("id","userId","headline","summary","currentEducation","currentInstitution","experienceYears","availability","completionScore","status","createdAt","updatedAt")
              VALUES ('d1b3e567-d7a7-48b6-b0cb-5e68a7bcabeb','5669c834-2de2-4a92-8b19-5835518a3323','Xxx','Xxccxxccvhghhgf','Xxxx','Xcccx','0','Xxcc','0','rejected','2026-07-05T02:44:21.731Z','2026-07-05T19:36:27.750Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "candidates" ("id","userId","headline","summary","currentEducation","currentInstitution","experienceYears","availability","completionScore","status","createdAt","updatedAt")
              VALUES ('635f69c1-8557-499c-9b8d-91fb984a719b','37f657e2-f2aa-46f8-acb4-fa19160f472b',NULL,NULL,NULL,NULL,'0',NULL,'0','rejected','2026-07-05T16:18:53.984Z','2026-07-05T19:37:28.091Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "candidates" ("id","userId","headline","summary","currentEducation","currentInstitution","experienceYears","availability","completionScore","status","createdAt","updatedAt")
              VALUES ('3adcc832-f489-4e31-8963-ea67f0378f8c','87f6564f-f390-4faf-9434-1c772757c1ef','IT','jshjsusus','A1','RP Tumba','0','now','60','active','2026-07-06T15:31:17.773Z','2026-07-07T15:27:21.147Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "candidates" ("id","userId","headline","summary","currentEducation","currentInstitution","experienceYears","availability","completionScore","status","createdAt","updatedAt")
              VALUES ('7916753b-217c-4109-9308-42fc823675e9','33743c66-194d-4275-958c-4f6dd298696a',NULL,NULL,NULL,NULL,'0',NULL,'40','active','2026-07-08T15:44:01.007Z','2026-07-08T16:06:08.111Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "applications" ("id","userId","candidateId","opportunityId","status","submittedAt","reviewNotes","adminNotes","decision","documents","createdAt","updatedAt")
              VALUES ('ee0ff28d-78e9-4187-bb10-04f17109ca2c',NULL,NULL,'9d68e17d-e3e6-44ac-a66c-c6a18a0f8f3d','APPROVED',NULL,NULL,'',NULL,'{"name":"N","email":"y@w.x","phone":"0782111185","message":"Na"}','2026-07-13T17:38:33.923Z','2026-07-15T06:57:13.172Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "applications" ("id","userId","candidateId","opportunityId","status","submittedAt","reviewNotes","adminNotes","decision","documents","createdAt","updatedAt")
              VALUES ('dd3a3987-94ba-4810-a023-cff80e2f51c9',NULL,NULL,'42b12122-1fc7-494a-b939-26bff9e103d5','APPROVED',NULL,NULL,'',NULL,'{"name":"Bigirimana Gibril ","email":"bigirimanagibril@gmail.com","phone":"+250795400005","message":"I need to perform well in this competition "}','2026-07-08T16:21:42.249Z','2026-07-15T06:57:30.881Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "applications" ("id","userId","candidateId","opportunityId","status","submittedAt","reviewNotes","adminNotes","decision","documents","createdAt","updatedAt")
              VALUES ('c628e00e-38ef-48be-ae46-d3e1da7105d4',NULL,NULL,'42b12122-1fc7-494a-b939-26bff9e103d5','APPROVED',NULL,NULL,'',NULL,'{"name":"ISHIMWE SAMUEL","email":"ishimwesamuel@gmail.com","phone":"0795064502","message":"mumfashe byaba a ri sawa cyane"}','2026-07-08T13:02:21.052Z','2026-07-15T06:57:34.657Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "applications" ("id","userId","candidateId","opportunityId","status","submittedAt","reviewNotes","adminNotes","decision","documents","createdAt","updatedAt")
              VALUES ('b2d36273-9241-40c6-a349-1d0886c150b5',NULL,NULL,'42b12122-1fc7-494a-b939-26bff9e103d5','APPROVED',NULL,NULL,'',NULL,'{"name":"Bigirimana Gibril ","email":"bigirimanagibril@gmail.com","phone":"250795400005","message":"I need to perform well in this competition "}','2026-07-08T16:22:57.202Z','2026-07-15T06:57:38.192Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "applications" ("id","userId","candidateId","opportunityId","status","submittedAt","reviewNotes","adminNotes","decision","documents","createdAt","updatedAt")
              VALUES ('a6011d20-64c7-4977-a7d1-3acdfe31cfe0',NULL,NULL,'9d68e17d-e3e6-44ac-a66c-c6a18a0f8f3d','APPROVED',NULL,NULL,'',NULL,'{"name":"Muhayimana Thomas ","email":"thomasmuhayi77@gmail.com","phone":"+250784371747","message":"I''m interested to attend this program "}','2026-07-11T18:04:36.407Z','2026-07-15T06:57:42.595Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "applications" ("id","userId","candidateId","opportunityId","status","submittedAt","reviewNotes","adminNotes","decision","documents","createdAt","updatedAt")
              VALUES ('85485f3b-9a8e-479a-aaec-2fe8460b2634',NULL,NULL,'42b12122-1fc7-494a-b939-26bff9e103d5','APPROVED',NULL,NULL,'',NULL,'{"name":"Nshimiyimana Patrick ","email":"ppatcreator@gmail.com","phone":"0783999980","message":""}','2026-07-13T18:16:35.452Z','2026-07-15T06:57:47.127Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "partners" ("id","name","logo","website","status","createdAt")
              VALUES ('47446963-9a1c-4f19-9a73-7bf9af7435e8','Uburezi Rwanda Tv','https://res.cloudinary.com/dlxiuwv30/image/upload/v1783523646/S8hg6hrkubLfgMhVjOIGp7zxyAWCo2zmeD5w4UZr7uBD9BcyFN1-rCxkrA5EwNylvZ34UGadf80_s900-c-k-c0x00ffffff-no-rj_ex2nvy.jpg','https://uburezirwandatv.blogspot.com','ACTIVE','2026-07-04T18:29:45.636Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "settings" ("id","key","value","group","createdAt","updatedAt")
              VALUES ('f484cc57-ae5e-4b42-8566-8e8dee786be0','maintenance_mode','false','general','2026-07-06T11:15:47.186Z','2026-07-06T11:27:00.135Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "settings" ("id","key","value","group","createdAt","updatedAt")
              VALUES ('895319bb-5ce8-427b-91f3-d46429718c85','siteName','Niroflixx','general','2026-07-04T18:11:13.222Z','2026-07-06T12:22:44.179Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "settings" ("id","key","value","group","createdAt","updatedAt")
              VALUES ('460a41d3-47d5-47bb-8477-71ef94e155fc','siteDescription','Learn, Grow, Succeed','general','2026-07-04T18:11:15.429Z','2026-07-06T12:22:44.487Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "settings" ("id","key","value","group","createdAt","updatedAt")
              VALUES ('24c2828d-d452-41fc-916b-fc629dacd1c0','contactEmail','robertniyonkuru001@gmail.com','general','2026-07-04T18:11:28.368Z','2026-07-06T12:22:45.133Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "settings" ("id","key","value","group","createdAt","updatedAt")
              VALUES ('52a7a3f9-62d0-4d49-9686-c9a2c4081cdb','contactPhone','+250795064502','general','2026-07-04T18:11:33.639Z','2026-07-06T12:22:46.112Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "settings" ("id","key","value","group","createdAt","updatedAt")
              VALUES ('2162efd4-00e5-42e1-9d4a-9956144e0831','contactAddress','Kigali, Rwanda','general','2026-07-04T18:11:40.282Z','2026-07-06T12:22:46.772Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "settings" ("id","key","value","group","createdAt","updatedAt")
              VALUES ('92fe6157-bcc4-495e-985d-b93e15fa09ac','facebook','https://facebook.com/nirobwimba','general','2026-07-04T18:11:52.498Z','2026-07-06T12:22:47.247Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "settings" ("id","key","value","group","createdAt","updatedAt")
              VALUES ('53d4587f-4d48-4af6-9396-aed4e8636b41','twitter','https://x.com/niroflixx','general','2026-07-04T18:12:06.074Z','2026-07-06T12:22:47.772Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "settings" ("id","key","value","group","createdAt","updatedAt")
              VALUES ('7ae7292d-24ba-450a-9e49-90d13e613e6a','instagram','https://instagram.com/nirobwimba','general','2026-07-04T18:12:11.820Z','2026-07-06T12:22:48.090Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "settings" ("id","key","value","group","createdAt","updatedAt")
              VALUES ('298ca859-2479-42ee-9da0-31a8d4f4613d','linkedin','https://linkedin.com/in/nirobwimba','general','2026-07-04T18:12:12.954Z','2026-07-06T12:22:48.474Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "settings" ("id","key","value","group","createdAt","updatedAt")
              VALUES ('edc80253-7ac7-4a43-98f0-fc8b9980935d','youtube','https://youtube.com/@kandahano','general','2026-07-04T18:12:13.757Z','2026-07-06T12:22:49.023Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "settings" ("id","key","value","group","createdAt","updatedAt")
              VALUES ('3cf583b6-400d-4125-8c75-a808d4b01532','github','https://github.com/Robniyo','general','2026-07-04T18:12:14.276Z','2026-07-06T12:22:49.710Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "settings" ("id","key","value","group","createdAt","updatedAt")
              VALUES ('7d70fe66-5b6a-44e2-8466-7992fef24a6d','tiktok','https://tiktok.com/@nirobwimba','general','2026-07-04T18:12:14.987Z','2026-07-06T12:22:50.100Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "settings" ("id","key","value","group","createdAt","updatedAt")
              VALUES ('6f419c9e-751e-4ea0-9d0e-0fba1d5e91af','whatsapp','+250795064502','general','2026-07-04T18:12:15.381Z','2026-07-06T12:22:50.406Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "contact_messages" ("id","name","email","subject","message","replied","createdAt")
              VALUES ('b39539d8-86c0-4734-9349-d0400d50b707','Bigirimana Gibril ','bigirimanagibril@gmail.com','New Application: 42b12122-1fc7-494a-b939-26bff9e103d5','Name: Bigirimana Gibril 
Email: bigirimanagibril@gmail.com
Phone: +250795400005

Message: I need to perform well in this competition ',false,'2026-07-08T16:21:42.257Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "contact_messages" ("id","name","email","subject","message","replied","createdAt")
              VALUES ('ba71f5b9-6771-4969-8465-3ac5ea914b76','Bigirimana Gibril ','bigirimanagibril@gmail.com','New Application: 42b12122-1fc7-494a-b939-26bff9e103d5','Name: Bigirimana Gibril 
Email: bigirimanagibril@gmail.com
Phone: 250795400005

Message: I need to perform well in this competition ',false,'2026-07-08T16:22:57.234Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "contact_messages" ("id","name","email","subject","message","replied","createdAt")
              VALUES ('388015fc-def2-4cda-8599-d9bb7d4a3f84','Muhayimana Thomas ','thomasmuhayi77@gmail.com','New Application: 9d68e17d-e3e6-44ac-a66c-c6a18a0f8f3d','Name: Muhayimana Thomas 
Email: thomasmuhayi77@gmail.com
Phone: +250784371747

Message: I''m interested to attend this program ',false,'2026-07-11T18:04:36.411Z')
              ON CONFLICT (id) DO NOTHING;
INSERT INTO "contact_messages" ("id","name","email","subject","message","replied","createdAt")
              VALUES ('42c0a364-624d-4ad6-a70e-3eaa90f10729','Nshimiyimana Patrick ','ppatcreator@gmail.com','New Application: 42b12122-1fc7-494a-b939-26bff9e103d5','Name: Nshimiyimana Patrick 
Email: ppatcreator@gmail.com
Phone: 0783999980

Message: No message',false,'2026-07-13T18:16:35.456Z')
              ON CONFLICT (id) DO NOTHING;
