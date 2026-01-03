// Auto-generated from exercises-parsed.json
// Generated: 2026-01-03T08:36:46.604Z

export interface ExerciseContent {
  id: string;
  type: 'video' | 'image';
  contentPath: string;
  azureExerciseVideoId: string | null;
  isActive: boolean;
  order: number;
  exerciseId: string;
  createdBy: string | null;
  modifiedBy: string | null;
  createdDate: string;
  modifiedDate: string | null;
  azureVideo: any | null;
  videoServer: string | null;
}

export interface Exercise {
  id: string;
  marathonExerciseId: string;
  exerciseName: string;
  marathonExerciseName: string;
  description: string;
  duration: number;
  status: 'NotStarted' | 'InProgress' | 'Completed';
  type: 'Practice' | 'Video' | 'Reading';
  exerciseContents: ExerciseContent[];
  order: number;
  commentsCount: number;
  isDone: boolean;
  isNew: boolean;
  blockExercise: boolean;
}

export const POSTURE_EXERCISES: Exercise[] = [
  {
    id: '4c203ead-0590-4ad4-81ae-34ceead16eac',
    marathonExerciseId: '00000000-0000-0000-0000-000000000000',
    exerciseName: 'Базовая растяжка шеи',
    marathonExerciseName: 'Базовая растяжка шеи',
    description: `<p><strong>Базовая растяжка шеи</strong></p><p>Отличное упражнение на шею, доступное в любое время. Есть минутка - потяни шею. Здесь мы используем его как тест для определения, готов ли ты к последующим, более продвинутым, упражнениям на шею. Делаем нежно, аккуратно, прислушиваемся к ощущениям. Растянуться шея может почти всегда, а возвращение в исходное положение может стать сложным, если в шее есть проблемы. Потихоньку растягиваемся и замечаем, как себя чувствует шея.</p><p><strong>Важно</strong></p><p>Когда мы говорим медленно, это значит медленно, резкое возвращение из растянутого состояния может принести неприятный сюрприз тем, у кого шея не подготовлена.</p><p>На что влияет растяжка шеи:</p><p>- Напряжение с мышц шеи снимается;</p><p>- Статика шеи исправляется;</p><p>- Двойной подборок начинает уменьшаться;</p><p>- Овал лица улучшается;</p><p>- Морщины на шее уменьшаются;</p><p>- Кожа на шее подтягивается.</p><p><strong>Техника</strong></p><p>- Встаем прямо, вытягиваемся макушкой вверх.</p><p>- Поворачиваем голову в одну сторону до упора, задерживаемся на 2 вдоха/выдоха, медленно возвращаем голову в исходное положение. Делаем такой же поворот в другую сторону.</p><p>- Наклоняем голову в одну сторону до упора, удерживаем на 1-2 вдоха/выдоха, медленно возвращаем голову в исходное положение.</p><p>Делаем такой же наклон в другую сторону.</p><p>- Очень медленно и осторожно вытягиваем подбородок вперед, не перестарайся. &nbsp;Без задержки, медленно возвращаем голову в исходное положение.</p><p>- Вытягиваем подбородок вверх. Тянем подбородок к потолку, не запрокидывая голову. Тянем подбородок вверх, дышим ровно, глубоко, 2 вдоха-выдоха. В этой позиции можно добавить вытяжение подбородка немного в одну сторону, потом в другую. Натяжение передней поверхности шеи значительно увеличится. Медленно возвращаем голову в исходное положение.&nbsp;</p><p>Это упражнение можно выполнять несколько раз в день, по ощущениям. Каждый раз выполняй его медленно и аккуратно.</p><p>Если ты делаешь это упражнение, и все проходит нормально, без резких болей, значит ты готов к более продвинутым приемам, которые мы разучим в последующие дни.</p><p>Если вдруг у тебя появились резкие боли, остановись, прислушайся к ощущениям. Попробуй малоамплитудные вращения головой. Вращается? Хорошо, практикуй такие вращения, а за ними эту растяжку. Очень аккуратно, до тех пор, пока дискомфорт в шее не прекратится, а затем переходи к изучению более продвинутых растяжек.</p><p><br></p><p>Резкие боли не позволяют свободно двигаться?... Что ж, случай для обращения к специалисту. Прекрати все упражнения на шею и проконсультируйся с врачом.</p><p><br></p><p><em>Будь осторожен, береги себя!<span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f642.svg);">&nbsp;</span>&nbsp;</em></p><p><br></p><p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;"> <a href="https://www.froala.com/wysiwyg-editor?pb=1" title=""></a></p>`,
    duration: 300,
    status: 'NotStarted' as const,
    type: 'Practice' as const,
    exerciseContents: [
      {
            id: "7bee0e91-9d8c-489f-8965-c5404545e28a",
            type: "image",
            contentPath: "https://new-facelift-service-b8cta5hpgcgqf8c7.eastus-01.azurewebsites.net/BeautifyManContent/Images/abfa60cb-029a-4823-ade9-4dbdca69c391.gif",
            azureExerciseVideoId: null,
            isActive: true,
            order: 1,
            exerciseId: "4c203ead-0590-4ad4-81ae-34ceead16eac",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "5f32ad93-9147-45bb-afb0-e1139766f0f7",
            type: "video",
            contentPath: "https://player.vimeo.com/video/510639105",
            azureExerciseVideoId: null,
            isActive: true,
            order: 2,
            exerciseId: "4c203ead-0590-4ad4-81ae-34ceead16eac",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "864fd312-c2ad-481c-94a0-41fc7d96ddb1",
            type: "video",
            contentPath: "https://youtu.be/MbAOHSo6jn8",
            azureExerciseVideoId: null,
            isActive: true,
            order: 3,
            exerciseId: "4c203ead-0590-4ad4-81ae-34ceead16eac",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      }
],
    order: 1,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: false,
  },
  {
    id: 'c54d0429-db51-48af-a890-03e2b257cae6',
    marathonExerciseId: '00000000-0000-0000-0000-000000000000',
    exerciseName: 'Вращения головой',
    marathonExerciseName: 'Вращения головой',
    description: `<p><strong>Вращения головой</strong></p><p>Потрясающее упражнение, которое поможет тебе вернуть шее подвижность! Базовое упражнение, которое можно делать в любое удобное время.</p><p>Это упражнение:</p><p>- улучшает функциональную подвижность шейной зоны (шейного отдела позвоночника);</p><p>- разогревает мышцы шеи;</p><p>- растворяет возможные застойные явления в шейной зоне;</p><p>- восстанавливает физиологический тонус мышц шеи до нормального;</p><p>- исправляет статику шеи;</p><p>- предотвращает остеохондроз и артрит в области шеи.</p><p><strong>Осторожно:</strong></p><p>Ты можешь заниматься в любое время дня в любой удобной ситуации. Сделай этот прием до того, как начнешь выполнять другие упражнения для шеи, а также после них. Но начни с очень аккуратных движений.</p><p>Если ты делаешь это впервые в жизни, тебя могут удивить потрескивающие звуки и возможная внезапная боль.</p><p><strong>Техника</strong></p><p>Не забывай контролировать свое дыхание при выполнении любых упражнений. Ровный глубокий вдох и такой же длины выдох.</p><p>Встань прямо, расслабь руки, опусти их вниз, вытянись макушкой вверх и расслабься. Назовем это &quot;короной на голове&quot;. Это красивый образ, будто у тебя на голове что-то очень важное :)).</p><p>Затем медленно опусти голову, как будто пытаешься на выдохе коснуться груди подбородком. Начни вращать голову вправо и вверх, делая полукруг на вдохе, пока твоя голова не займет положение, когда затылок смотрит вниз, а глаза вверх.</p><p>Продолжай вращение из этого положения на выдохе, направив &quot;корону&quot; влево, затем снова опусти подбородок. Представь, что корона рисует круги над твоей головой.</p><p>Продолжай вращение вправо и сделай это еще 2 раза. Не торопись! Продолжай делать прием осторожно, даже если после первого круга ты чувствуешь себя хорошо.</p><p>Сделай те же вращения влево. 3 раза. Продолжай делать их медленно и осторожно.</p><p>Чем шире у тебя круги, чем больше кругов ты сможешь нарисовать своей короной, тем более гибкой и подготовленной к дальнейшим упражнениям будет твоя шея.</p><p><strong>Внимание!</strong></p><p>Техника проста, но, пожалуйста, обрати внимание на то, что ты чувствуешь во время выполнения упражнения. Любая резкая боль может быть сигналом о наличии шейного остеохондроза (ШОС). В этом случае нужно быть очень осторожным и внимательным к области шеи. Любые другие упражнения для шеи следует выполнять очень аккуратно.</p><p>Не проси меня диагностировать, что может быть у тебя с шеей, я не врач. Кроме того, в этом случае для постановки правильного диагноза необходимо лично обратиться к врачу и пройти ряд обследований.</p><p><strong>Боль:</strong></p><p>ПОЖАЛУЙСТА, НЕ ДУМАЙ, ЧТО ЭТО НЕ ТВОЙ СЛУЧАЙ!</p><p>Я совершил эту ошибку, когда впервые сделал это упражнение для шеи в возрасте 40 лет, через 8 лет после моего последнего занятия йогой. Я думал, что все еще достаточно гибок, и растянуть шею будет легкой задачей.</p><p>Это было Очень просто! Но.... я потянул шею уже на втором круге, из-за этого я не мог выполнять другие приемы для шеи в течение следующих нескольких месяцев. Пришлось понизить амплитуду в упражнениях и пройти курс реабилитации, чтобы вернуть шее подвижность, силу и ощущение здоровья. Этот курс теперь называется &laquo;Успокойся&raquo;, он состоит из 20 простых упражнений, направленных на возвращение подвижности позвоночнику, и ты можешь найти этот удивительный курс в приложении.</p><p><strong>Дополнительно:</strong></p><p>Повороты головой можно делать и в сидячем положении. Положение стоя более предпочтительно только потому, что все следующие упражнения для шеи выполняются из положения стоя.</p><p><em>Удачи!</em></p><p><br></p><p>Как первый раз?</p><p>Бьюсь об заклад, ты услышал много интересных звуков! :)) Щелчки, хруст и даже треск вполне нормальны... Даже ожидаемы.</p><p>Я делаю это упражнение каждый день последние 4 года. Моя шея все еще время от времени щелкает и хрустит, но намного меньше, чем раньше, и у меня больше нет никаких опасений по поводу неожиданных прострелов.</p><p><br></p><p>У тебя внезапная боль? Не стесняйся проконсультироваться с врачом!</p><p>Мы поговорим о причинах возможной боли позже, в теоретической статье.</p><p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;"> <a href="https://www.froala.com/wysiwyg-editor?pb=1" title=""></a></p>`,
    duration: 300,
    status: 'NotStarted' as const,
    type: 'Practice' as const,
    exerciseContents: [
      {
            id: "65892dd7-b240-48e8-89be-9079e7e1c7c8",
            type: "image",
            contentPath: "https://new-facelift-service-b8cta5hpgcgqf8c7.eastus-01.azurewebsites.net/BeautifyManContent/Images/d0179a17-dce7-4ab4-8a9b-a2e06f67e3ed.gif",
            azureExerciseVideoId: null,
            isActive: true,
            order: 1,
            exerciseId: "c54d0429-db51-48af-a890-03e2b257cae6",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "cc0220f2-56f9-4fed-9a71-709a9597a75a",
            type: "video",
            contentPath: "https://player.vimeo.com/video/510135465",
            azureExerciseVideoId: null,
            isActive: true,
            order: 3,
            exerciseId: "c54d0429-db51-48af-a890-03e2b257cae6",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "e36d8fcb-49dc-4da6-bae9-ba1c948c59f1",
            type: "video",
            contentPath: "https://youtu.be/CwVvJqXgBFw",
            azureExerciseVideoId: null,
            isActive: true,
            order: 3,
            exerciseId: "c54d0429-db51-48af-a890-03e2b257cae6",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      }
],
    order: 2,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: false,
  },
  {
    id: 'c31c761f-ef35-4189-9f05-a12009775c22',
    marathonExerciseId: '00000000-0000-0000-0000-000000000000',
    exerciseName: 'Растяжка передней поверхности шеи',
    marathonExerciseName: 'Растяжка передней поверхности шеи',
    description: `<p><strong>Растяжка передней поверхности шеи</strong></p><p>Комплекс упражнений на шею (1) .</p><p>Незаменимая базовая техника для здоровья твоей шеи!<span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f4aa.svg);">&nbsp;</span>&nbsp;</p><p>- Шея становится длиннее и сильнее;</p><p>- Увеличивается подвижность головы;</p><p>- Напряжение снимается;</p><p>- Передняя часть шеи подготовлена для специальных техник на зону двойного подбородка;</p><p>- Незаменимая подготовка ко всем следующим упражнениям.</p><p><strong>Осторожно!</strong></p><p>Как и все упражнения для шеи, выполняй их очень медленно и осторожно! Если ты сделаешь все правильно, ты будешь чувствовать себя комфортно в любой момент во время практики.</p><p>Это упражнение лучше выполнять мягко нежели усердно.</p><p>Дыши ровно во время любых упражнений. Это очень важно для результата.<span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f64f.svg);">&nbsp;</span>&nbsp;</p><p><strong>Техника</strong></p><p>- Встань прямо, макушку вытяни вверх. Подними руки вверх и возьмись за локти над головой, плечи подтяни к ушам.&nbsp;</p><p>- Наклони голову вперед с легким давлением. Между подбородком и грудью могут быть мягкие ткани, это нормально. Если есть, просто прижми их подбородком к груди.</p><p>- Продолжай слегка прижимать подбородок к груди в течение следующих 4 вдохов - выдохов.</p><p>- Дыши равномерно.</p><p>- После четвертого выдоха начни поднимать подбородок к потолку, опусти руки и расслабься.</p><p>- Медленно вытяни подбородок к потолку, почувствуй растяжение в передней части шеи, сохрани это положение в течение следующих 4-х вдохов - выдохов.</p><p>Повтори это еще раз, если захочешь.</p><p><strong>Внимание!</strong></p><p>Не позволяй голове полностью откинуться назад, когда вытягиваешь подбородок наверх, шея может перегнуться. Это ошибка. Такая ошибка может стоить тебе возможной боли и люмбаго, поэтому, вытягивая подбородок вверх, держи заднюю часть шеи как можно более вытянутой.</p><p><br></p><p>После растяжки передней части шеи обязательно проделай упражнение для ее тыльной стороны.</p><p><br></p><p><em>Береги себя! <span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f609.svg);">&nbsp;</span>&nbsp;</em></p><p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>`,
    duration: 300,
    status: 'NotStarted' as const,
    type: 'Practice' as const,
    exerciseContents: [
      {
            id: "dbc90b33-1a31-4f59-9585-8c0b2ebbfabd",
            type: "image",
            contentPath: "https://new-facelift-service-b8cta5hpgcgqf8c7.eastus-01.azurewebsites.net/BeautifyManContent/Images/f04fd7ab-8549-4dbf-b812-b8a8beaa03d1.gif",
            azureExerciseVideoId: null,
            isActive: true,
            order: 1,
            exerciseId: "c31c761f-ef35-4189-9f05-a12009775c22",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "6d1f06fc-f6b7-4db9-ae58-78b97adcc56c",
            type: "video",
            contentPath: "https://player.vimeo.com/video/510639019",
            azureExerciseVideoId: null,
            isActive: true,
            order: 2,
            exerciseId: "c31c761f-ef35-4189-9f05-a12009775c22",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      }
],
    order: 3,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: false,
  },
  {
    id: '9dd63c7a-60e0-476c-acfb-5264d0de3fc2',
    marathonExerciseId: '00000000-0000-0000-0000-000000000000',
    exerciseName: 'На заднюю поверхность шеи',
    marathonExerciseName: 'На заднюю поверхность шеи',
    description: `<p><strong>На заднюю поверхность шеи</strong></p><p>Комплекс упражнений на шею (2)&nbsp;</p><p>Незаменимая базовая техника для здоровой шеи!<span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f4aa.svg);">&nbsp;</span>&nbsp;</p><p>- Шея становится длиннее и сильнее;</p><p>- Увеличивается подвижность головы;</p><p>- Напряжение снимается;</p><p>- Задняя часть шеи растягивается и становится более гибкой;</p><p>- Незаменимая подготовка ко всем следующим упражнениям.</p><p><strong>Осторожно!</strong></p><p>Как и все упражнения для шеи, выполняй их очень медленно и осторожно! Если ты сделаешь все правильно, ты будешь чувствовать себя комфортно в любой момент во время практики.</p><p>С шеей работать мягко лучше, чем усердно.</p><p>Дыши ровно во время любых упражнений. Это очень важно для результата.</p><p><strong>Техника</strong></p><p>1е действие. Сокращаем мышцы.</p><p>- Встань в вертикальное положение, макушку вытяни вверх.</p><p>- Соедини руки вместе за поясницей. Подними сцепленные руки вверх как можно выше, держа руки прямыми. Твои трапециевидные мышцы сформируются в холмик.</p><p>- Используй холмик как основу для головы, медленно опусти голову на холмик.</p><p>- Оставайся в этом положении на 4 вдоха - выдоха.</p><p>- Контролируй свое дыхание. Дыши равномерно, не задерживай дыхание.</p><p>- После четвертого выдоха начни медленно двигать головой вверх на вдохе.</p><p>- Зафиксируй голову в вертикальном положении на пару секунд и переходи к растяжке.</p><p>2е действие. Растяжка.</p><p>- Подними руки, сцепи их пальцами в замок и положи на затылок.</p><p>- Расслабь плечи и руки, держа руки на затылке. Ты почувствуешь, как вес твоих рук слегка опускает твою голову. Позволь ему это сделать, но НЕ дави сам с силой. Достаточно одного веса твоих рук, чтобы получить нужный результат.</p><p>- Наклони голову вниз, почувствуй растяжение в задней части шеи, расслабь руки.</p><p>- Оставайся в этом положении в течение следующих 4 вдохов - выдохов.</p><p>- Контролируй свое дыхание. Дыши равномерно, не задерживай дыхание.</p><p>3е действие. Вертикальный идеал.</p><p>- После последнего выдоха на вдохе &nbsp;начинай медленно поднимать голову вверх со сцепленными руками, компенсируя это движение небольшим сопротивлением.</p><p>- Зафиксируй голову в идеально вертикальном положении. Голова слегка упирается в сцепленные руки.</p><p>- Оставайся в этом положении на 2 цикла &quot;вдох-выдох&quot;. Дыши глубоко и равномерно.</p><p>Повтори действия 2 и 3 по 2 цикла &quot;вдох-выдох&quot; каждое.</p><p>- Закрой глаза на несколько секунд и ощути свою шею и ее новое положение.<span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f60c.svg);">&nbsp;</span>&nbsp;</p><p><strong>Внимание!</strong></p><p>Никакого давления на голову, пока она наклонена к груди! Только вес твоих рук должен оказывать естественное давление. Если ты думаешь, что твои руки могут быть слишком тяжелыми, тебе следует быть особенно осторожным и попытаться компенсировать естественное давление, чтобы сделать их легче.</p><p>Это упражнение хорошо само по себе, но ты никогда не должен пропускать его при выполнении комплекса для шеи.</p><p><br></p><p><em>Успехов!&nbsp;</em> <span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f642.svg);">&nbsp;</span>&nbsp;</p><p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>`,
    duration: 300,
    status: 'NotStarted' as const,
    type: 'Practice' as const,
    exerciseContents: [
      {
            id: "8a4bbd09-154f-49e7-bf23-98348ec43864",
            type: "image",
            contentPath: "https://new-facelift-service-b8cta5hpgcgqf8c7.eastus-01.azurewebsites.net/BeautifyManContent/Images/bf3673e7-da7a-4d9a-ab4e-8f16d8082ac7.gif",
            azureExerciseVideoId: null,
            isActive: true,
            order: 1,
            exerciseId: "9dd63c7a-60e0-476c-acfb-5264d0de3fc2",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "40d57222-084b-40f2-a4d2-9868913a5070",
            type: "video",
            contentPath: "https://player.vimeo.com/video/511055185",
            azureExerciseVideoId: null,
            isActive: true,
            order: 2,
            exerciseId: "9dd63c7a-60e0-476c-acfb-5264d0de3fc2",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      }
],
    order: 4,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: false,
  },
  {
    id: '2ed8b873-e5dc-4d83-8058-f926827afaf0',
    marathonExerciseId: '00000000-0000-0000-0000-000000000000',
    exerciseName: 'На боковую поверхность шеи',
    marathonExerciseName: 'На боковую поверхность шеи',
    description: `<p><strong>Растяжка боковой поверхности шеи</strong></p><p>Комплекс упражнений на шею. (3)&nbsp;</p><p>Базовое упражнение на каждый день!</p><p>- Твоя шея становится длинной и сильной;</p><p>- Боковые мышцы шеи расслабляются, кровоснабжение улучшается;</p><p>- Снижается напряжение в плечах;</p><p>- Улучшается кровоснабжение головы, что снимает головные боли и боли в плечах.</p><p><strong>Осторожно!</strong></p><p>Если ты сделаешь все правильно, то будешь чувствовать себя комфортно в любой момент во время практики.</p><p>Медленные и плавные движения - залог здоровой шеи в этом упражнении. Слово &laquo;компенсация&raquo; здесь означает легкое давление против основного движения.</p><p><strong>Техника</strong></p><p>1е действие. Сокращаем мышцы.</p><p>- Встань в вертикальное положение, вытяни макушку вверх, расслабь плечи и руки.</p><p>- Положи правую руку на пояс так, чтобы твоя рука и бок туловища образовали треугольник. Теперь вытяни длинную сторону этого треугольника, приподняв правое плечо как можно выше. Твоя трапециевидная мышца должна образовать холмик.</p><p>- Используй этот холмик как основу для шеи и головы, медленно наклоняй голову к поднятому плечу. Твоя шея должна плотно прилегать к холмику, который ты создал своей трапециевидной мышцей, ухо необязательно должно касаться плеча - это не то, к чему мы стремимся. Цель состоит в том, чтобы слегка прижать сжатые трапеции с правой стороны шеи.</p><p>- Контролируй свое дыхание. Дыши ровно. Постарайся сделать вдох и выдох одинаково длинными.</p><p>- Сохраняй это положение на 4 глубоких вдоха - выдоха;&nbsp;</p><p>- Верни голову в вертикальное положение и позволь напряженной руке расслабиться.</p><p>2е действие. Растяжка.</p><p>- Держи голову в вертикальном положении. Положи левую руку на голову, как будто пытаешься схватить правое ухо. Положи левую ладонь на правую сторону головы, захватив ухо пальцами.</p><p>- Медленно наклони голову влево - на противоположную сторону от того места, где раньше был холмик. Холмик и шея теперь растягиваются.</p><p>- Рука лежит на голове без напряжения, держи ее расслабленной. Рука выполняет легкое давление, используя только собственный вес. Не надавливай специально!</p><p>- Расслабь плечо руки, лежащей на голове.</p><p>- Контролируй свое дыхание. Дыши ровно. Постарайся одинаково долго вдыхать и выдыхать.</p><p>- Сохраняй это положение для следующих 4 глубоких вдохов - выдохов.</p><p>- Медленно верни голову в вертикальное положение. Рука теперь компенсирует возвращение головы, удерживая шею в вытянутом состоянии. Пусть ладонь будет на прежнем месте до самого конца действия.</p><p>- Когда твоя голова вернется в вертикальное положение, а рука компенсирует это легким давлением, сохраняй это компенсирующее давление в течение следующих 2 вдохов и выдохов. И голова, и рука &quot;стремятся&quot; удерживать голову в идеальном вертикальном положении.</p><p>- Снова начни медленно растягивать шею. Оставайся в растянутом положении на 2 цикла вдоха и выдоха. Верни голову в вертикальное положение с компенсирующим давлением рукой.</p><p>- Теперь опусти руку. Расслабься. Закрой глаза на 5 секунд и прочувствуй разницу между левой и правой стороной.</p><p>Повтори последовательность для другой стороны тела.</p><p><strong>Внимание!</strong></p><p>Как и все упражнения для шеи, выполняй их очень медленно и внимательно относись к своим ощущениям. Если ты все сделаешь правильно и будешь держать шею как можно дольше в каждой позиции, ты не испытаешь никакого дискомфорта.</p><p>! НЕ пытайся достать ушами до плеч. Это может вызвать серьезные проблемы с шеей; это не то действие, которое нам нужно.</p><p><strong>Личный опыт:</strong></p><p>Я делаю это упражнение каждый день. Хотя бы один раз утром в составе шейного комплекса. Я также делаю это в любое другое время дня, когда чувствую дискомфорт в области шеи и плеч. Это отличная техника релаксации!</p><p><br></p><p>Уже попробовал?</p><p>Каковы были твои ощущения в левой и правой части перед тем, как ты сделал подход на противоположную сторону?</p><p><br></p><p><em>Береги свою шею!</em></p><p><em>Это пьедестал твоего симпатичного лица</em> <span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f609.svg);">&nbsp;</span>&nbsp;</p><p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;"> <a href="https://www.froala.com/wysiwyg-editor?pb=1" title=""></a></p>`,
    duration: 300,
    status: 'NotStarted' as const,
    type: 'Practice' as const,
    exerciseContents: [
      {
            id: "4298fdd1-6e5e-4c5d-a536-4beeced293ee",
            type: "image",
            contentPath: "https://new-facelift-service-b8cta5hpgcgqf8c7.eastus-01.azurewebsites.net/BeautifyManContent/Images/f6c9b923-aebd-49c2-a6f7-c810f72cf2b1.gif",
            azureExerciseVideoId: null,
            isActive: true,
            order: 1,
            exerciseId: "2ed8b873-e5dc-4d83-8058-f926827afaf0",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "5e2fec63-215d-43de-be01-9f207bf56ad8",
            type: "video",
            contentPath: "https://player.vimeo.com/video/511055147",
            azureExerciseVideoId: null,
            isActive: true,
            order: 2,
            exerciseId: "2ed8b873-e5dc-4d83-8058-f926827afaf0",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "1b6f45ba-a046-44b5-bc7a-95742fb40ad9",
            type: "video",
            contentPath: "https://youtu.be/QGGhI3uejr0",
            azureExerciseVideoId: null,
            isActive: true,
            order: 3,
            exerciseId: "2ed8b873-e5dc-4d83-8058-f926827afaf0",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      }
],
    order: 5,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: false,
  },
  {
    id: 'eae9d289-4eb5-4c8f-9617-20f1d88b19e1',
    marathonExerciseId: '00000000-0000-0000-0000-000000000000',
    exerciseName: 'На мышцы трапеции',
    marathonExerciseName: 'На мышцы трапеции',
    description: `<p><strong>На мышцы трапеции</strong></p><p>Комплекс упражнений на шею. (4)&nbsp;</p><p>- Улучшается осанка;</p><p>- Шея становится длиннее и сильнее;</p><p>- Снимается напряжение в плечах;</p><p>- Улучшается кровоснабжение головы;</p><p>- Тело чувствует себя лучше в целом.</p><p><strong>Осторожно!</strong></p><p>Выполняй это упражнение медленно и осторожно. Помни, надо быть особенно внимательным, если никогда не растягивал мышцы шеи раньше. Если выполнять технику правильно, шея станет только крепче и длиннее.</p><p><strong>Техника</strong></p><p>1е действие. Опереться на холмик.</p><p>- Встань в вертикальном положении, положив руку на пояс так, что большой палец смотрит вниз, а средний палец в сторону позвоночника. Отведи локоть назад. Твоя рука и бок туловища составят треугольник.&nbsp;</p><p>- Теперь вытяни длинную сторону этого треугольника, подняв плечо как можно выше. Твоя трапециевидная мышца должна образовать холмик. Этот холмик станет опорой для затылка.&nbsp;</p><p>- Теперь поверни голову в сторону, противоположную холмику, и посмотри вверх. Затылок должен удобно улечься на холмике. Напряжен только холмик, старайся держать все оставшееся тело расслабленным.&nbsp;</p><p>- Оставайся в этом положении на 4 &nbsp;вдоха - выдоха. Дыши равномерно.</p><p>2е действие. Растяжка.</p><p>- Верни голову в вертикальное положение и позволь напряженной руке расслабиться.</p><p>- Другой рукой возьмись за затылок так, чтобы запястье лежало на макушке, а пальцы были направлены вниз. Бицепс должен оказаться перед носом. Рука здесь контролирует последующее растяжение.</p><p>- Наклони голову к груди, затем медленно перемести ее к подмышке контролирующей руки. Подтяни подбородок к подмышке.&nbsp;</p><p>- Оставайся в этом положении на 4 вдоха-выдоха. Дыши равномерно, почувствуй, как растягиваются мышцы, начиная от черепа и заканчивая плечом.</p><p>3е действие. Растяжка с компенсацией.</p><p>Верни голову в вертикальное положение, двигаясь назад по той же траектории, по которой голова попала в это положение. Контролирующая рука компенсирует движение головы в вертикальное положение своим естественным весом.</p><p>Оставайся в вертикальном положении на следующие 2 вдоха - выдоха. Контролирующая рука фиксирует голову и не позволяет ей откинуться назад. Рука поддерживает более сильную шею, компенсируя это движение. Взаимное сопротивление вытягивает голову вверх.</p><p>Повтори последовательность растяжки и фиксации и удерживай их по 2 вдоха - выдоха каждую.</p><p>Это последнее упражнение комплекса шеи. После этого желательно сделать вращения головой.</p><p><strong>Внимание!</strong></p><p>Контролирующая рука предназначена только для управления. Не дави ею при растяжке. Ее собственного веса как раз хватает для естественного давления. Если ты думаешь, что твоя рука может быть слишком тяжелой, не позволяй всей ее массе ложиться тебе на голову. Прислушивайся к своему телу и постарайся найти правильное давление.</p><p><br></p><p>Выполняй комплекс упражнений для шеи каждый день, и вскоре ты удивишься, насколько длиннее стала твоя шея.))</p><p><br></p><p><em>Наслаждайся моментом! <span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f44f.svg);">&nbsp;</span>&nbsp;</em></p><p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;"> <a href="https://www.froala.com/wysiwyg-editor?pb=1" title=""></a></p>`,
    duration: 300,
    status: 'NotStarted' as const,
    type: 'Practice' as const,
    exerciseContents: [
      {
            id: "ee2d0ea3-0bef-4a14-b438-a3d44e45a91a",
            type: "image",
            contentPath: "https://new-facelift-service-b8cta5hpgcgqf8c7.eastus-01.azurewebsites.net/BeautifyManContent/Images/1fc8d331-85f6-4cd9-bd52-27ef353abf1c.gif",
            azureExerciseVideoId: null,
            isActive: true,
            order: 1,
            exerciseId: "eae9d289-4eb5-4c8f-9617-20f1d88b19e1",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "75e8d5d9-d55e-4820-b453-4904a772586d",
            type: "video",
            contentPath: "https://player.vimeo.com/video/514202961",
            azureExerciseVideoId: null,
            isActive: true,
            order: 2,
            exerciseId: "eae9d289-4eb5-4c8f-9617-20f1d88b19e1",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "bd51df61-8087-46ae-9c50-b77c2f613300",
            type: "video",
            contentPath: "https://youtu.be/5hOkj_vE5yM",
            azureExerciseVideoId: null,
            isActive: true,
            order: 3,
            exerciseId: "eae9d289-4eb5-4c8f-9617-20f1d88b19e1",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      }
],
    order: 6,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: false,
  },
  {
    id: 'bec0210f-646d-4d63-b4a0-aa8e419aeca2',
    marathonExerciseId: '00000000-0000-0000-0000-000000000000',
    exerciseName: 'Раскрытие плечевых 1',
    marathonExerciseName: 'Раскрытие плечевых 1',
    description: `<p><strong>Вытяжение позвоночника, раскрытие плечевых суставов</strong></p><p>Легкое и эффективное упражнение на раскрытие плечевого пояса. &nbsp;&nbsp;</p><p>- Плечи становятся более подвижными.<br>- Грудь раскрывается, что приносит облегчение в области груди и плеч.<br>- Улучшается осанка и статика шеи.</p><p><strong>Осторожно:</strong> Используй естественный вес своего тела. Давить не нужно!</p><p><strong>Техника&nbsp;</strong><br>- Подойди к чистой стене, вытянутые руки поставь на стену на уровне лба и немного шире плеч.<br>- Сделай шаг назад, держа руки на одном месте.<br>- Наклонись, не смещая прямые руки, удерживая позвоночник и ноги в прямом состоянии. Почувствуй натяжение в грудных и плечевых мышцах (дельтовидных).<br>- Дыши равномерно. Оставайся в этом положении для растяжки от 4 до 10 вдохов-выдохов.<br>- Вернись в вертикальное положение и почувствуй разницу. Попробуй покрутить руками, вытяни их вверх.</p><p><strong>Внимание!&nbsp;</strong>Если твои плечи уже достаточно гибкие, а голова (при условии прямой линии позвоночника) опускается ниже плеч, растяжка должна выполняться следующим образом: макушку тянем к стене. <span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f4aa.svg);">&nbsp;</span>&nbsp; Ну, если ты настолько гибкий, то наверняка уже знаешь, как правильно это делать. &nbsp;&nbsp;</p><p><br></p><p>Растягивайся и расслабляйся! &nbsp; <span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f60c.svg);">&nbsp;</span>&nbsp;</p><p><br></p><p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>`,
    duration: 300,
    status: 'NotStarted' as const,
    type: 'Practice' as const,
    exerciseContents: [
      {
            id: "cc0a48d4-96c6-47fc-b2ee-250a4989b09a",
            type: "image",
            contentPath: "https://new-facelift-service-b8cta5hpgcgqf8c7.eastus-01.azurewebsites.net/BeautifyManContent/Images/44394291-ff27-4243-a475-397b8f233f7b.gif",
            azureExerciseVideoId: null,
            isActive: true,
            order: 1,
            exerciseId: "bec0210f-646d-4d63-b4a0-aa8e419aeca2",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "1b89ec4f-6858-4d21-b5e2-34c868328f9a",
            type: "video",
            contentPath: "https://player.vimeo.com/video/514203123",
            azureExerciseVideoId: null,
            isActive: true,
            order: 2,
            exerciseId: "bec0210f-646d-4d63-b4a0-aa8e419aeca2",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      }
],
    order: 7,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: true,
  },
  {
    id: '24a6f431-9200-4c27-b491-09c9f4b96a20',
    marathonExerciseId: '00000000-0000-0000-0000-000000000000',
    exerciseName: 'Раскрытие плечевых 2',
    marathonExerciseName: 'Раскрытие плечевых 2',
    description: `<p><strong>Растяжка плеча</strong><br><br>Дополнительное обучающее <a href="https://vkvideo.ru/video-227551209_456239162?list=ln-yoRYMLCnUBeto54tbR">видео</a><a href="https://vkvideo.ru/video-227551209_456239162?list=ln-yoRYMLCnUBeto54tbR"><strong><img src="https://new-facelift-service-b8cta5hpgcgqf8c7.eastus-01.azurewebsites.net/BeautifyManContent/Images/90060a74-42f7-4f01-9a89-0b2fb5cae959.png" style="width: 300px;" class="fr-fic fr-dib"></strong></a><br></p><p>Легкое и эффективное упражнение на раскрытие плечевого пояса. &nbsp;&nbsp;</p><p>- Плечи становятся более подвижными.<br>- Грудь раскрывается, что снимает спазмы и приносит облегчение в области груди и плеч.<br>- Улучшается осанка и статика шеи.</p><p><strong>Осторожно:</strong> Используй естественный вес своего тела. Давить не нужно!</p><p><strong>Техника&nbsp;</strong><br>- Подойди к чистой стене, положи ладонь на стену на уровне плеча. Не отрывая ладони, подойди вплотную к стене так, чтобы вся рука плотно прижалась к стене. Таким образом вся рука окажется на стене, параллельно полу.<br>- Отведи другое плечо максимально от стены, на столько, насколько позволит растяжка.<br>- Растяни свое плечо и грудную мышцу максимально. Разверни стопу, противоположную растягиваемой руке, еще на 45-90 градусов в сторону растягиваемого плеча. Позволь тазу последовать за стопой, за тазом потянется и разворачиваемое плечо.<br>- Удерживай растяжку, дыши равномерно. Растягивайся в этом положении от 4 до 10 вдохов-выдохов.<br>- Вернись в исходное положение, повторяя действия в обратном порядке: расслабь таз, верни стопу, расслабь растяжку плеча, сними руку со стены.<br>- Повтори ту же последовательность для другой руки.&nbsp;</p><p>Растягивайся и расслабляйся! &nbsp;&nbsp;</p><p>Почувствуй свободу дыхания <span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f60c.svg);">&nbsp;</span>&nbsp;</p><p><br></p><p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>`,
    duration: 300,
    status: 'NotStarted' as const,
    type: 'Practice' as const,
    exerciseContents: [
      {
            id: "eb9ae370-2ceb-4421-8f1d-2f673586e6c2",
            type: "image",
            contentPath: "https://new-facelift-service-b8cta5hpgcgqf8c7.eastus-01.azurewebsites.net/BeautifyManContent/Images/a86199aa-f1c6-4c12-b1a6-79dd6f0f7464.gif",
            azureExerciseVideoId: null,
            isActive: true,
            order: 1,
            exerciseId: "24a6f431-9200-4c27-b491-09c9f4b96a20",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "679ff18c-f070-455d-bf90-4fcc2176db60",
            type: "video",
            contentPath: "https://player.vimeo.com/video/514203151",
            azureExerciseVideoId: null,
            isActive: true,
            order: 2,
            exerciseId: "24a6f431-9200-4c27-b491-09c9f4b96a20",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      }
],
    order: 8,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: true,
  },
  {
    id: 'a8d8a1f3-6765-4031-bbb8-cf0baf47f7af',
    marathonExerciseId: '00000000-0000-0000-0000-000000000000',
    exerciseName: 'Стоечка у стены',
    marathonExerciseName: 'Стоечка у стены',
    description: `<p><strong>Стоечка у стены</strong></p><p>Это упражнение - царь упражнений для осанки!&nbsp;</p><p>Это незаменимый прием для возвращения головы в здоровое положение. Упражнение статическое, кажется легким, однако лучше сначала попробовать, прежде, чем выносить такие суждения.<span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f609.svg);">&nbsp;</span>&nbsp; Первый раз попробуй выдержать минуту, затем ты можешь постепенно увеличивать продолжительность, в идеале до 10 минут в день. <span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f4aa.svg);">&nbsp;</span>&nbsp;</p><p>Что дает нам стоечка у стены:&nbsp;</p><p>- Улучшается статика шеи.&nbsp;</p><p>- Шея становится длинной и сильной.&nbsp;</p><p>- Позвоночник вспомнит свое выпрямленное естественное положение.&nbsp;</p><p>- Потребление кислорода увеличивается, поскольку в этой позе ваши легкие могут поглощать больше воздуха.&nbsp;</p><p>- Нервная система укрепляется.</p><p><strong>Внимание:&nbsp;</strong></p><p>! Стоечка не подходит для беременных. Возможно головокружение, дрожь в икрах и руках.</p><p><strong>Техника:</strong>&nbsp;</p><p>- Найди чистую стену, в идеале без плинтуса, чтобы пятки касались той же поверхности, на которую будет опираться твоя голова. Над головой должно быть достаточно места, чтобы ты мог свободно двигаться вверх.&nbsp;</p><p>- Встань спиной к стене. Пятки, икры, ягодицы, поверхность лопаток должны касаться стены.&nbsp;</p><p>- Выпрями шею и направь макушку вверх, прислонись затылком к стене и смотри прямо. При желании можно во время упражнения закрыть глаза. <span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f60c.svg);">&nbsp;</span>&nbsp;</p><p>- Расслабляйся. Позволь всем мышцам сбросить напряжение, только некоторые мышцы спины немного напряжены, чтобы удерживать позвоночник ровно вдоль по стене и держать лопатки расправленными.</p><p>- Во время расслабления держи икры, лопатки и затылок хорошо прижатыми к стене. Подправь положение, если почувствовал, что кто-то &quot;убежал от стены&quot;.<span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f605.svg);">&nbsp;</span>&nbsp;</p><p>- Постепенно прижимайся к стене, сохраняя расслабленное состояние. Руки должны быть расслаблены.</p><p>Если ты тот, кто занимается по 10 минут каждый день, ты точно король осанки! Через месяц практики проверь свой рост, и не удивляйся, если ты станешь на 1-1,5 см выше.<span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f44d.svg);">&nbsp;</span>&nbsp;</p><p><strong>Внимание:&nbsp;</strong></p><p>Если у тебя избыточный вес, будет затруднительно соприкоснуться пятками, икрами и ягодицами с одной и той же поверхностью. В этом случае отойди немного от стены, но обязательно держи ягодицы, лопатки и затылок прижатыми к стене. Ты можешь испытывать странные ощущения во всем теле, которые обычны для новичков. Это может быть дрожь, зуд, легкое онемение в ногах и руках. Это будет постепенно утихать с каждым днем. Однажды ты обнаружишь, что отдыхаешь в этой позе, я обещаю. <span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/270c.svg);">&nbsp;</span>&nbsp;</p><p><br></p><p>Каждый раз после этого упражнения я чувствую себя новым человеком. Отныне это упражнение всегда будет помогать тебе улучшить осанку и облегчить дискомфортные ощущения в спине и шее. Нет ничего более эффективного, чем стоечка у стены для улучшения осанки и статики шеи.</p><p><br></p><p><em>Удачи! <span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f60c.svg);">&nbsp;</span>&nbsp;</em></p><p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;"> <a href="https://www.froala.com/wysiwyg-editor?pb=1" title=""></a></p>`,
    duration: 300,
    status: 'NotStarted' as const,
    type: 'Practice' as const,
    exerciseContents: [
      {
            id: "55f80351-a1c2-42cb-bc79-ccd0759b3de5",
            type: "image",
            contentPath: "https://new-facelift-service-b8cta5hpgcgqf8c7.eastus-01.azurewebsites.net/BeautifyManContent/Images/97dc4d9c-9479-49db-8645-b25dfeeb5b0e.gif",
            azureExerciseVideoId: null,
            isActive: true,
            order: 1,
            exerciseId: "a8d8a1f3-6765-4031-bbb8-cf0baf47f7af",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "3faaccf9-4cb7-4416-9baf-91bfe043186a",
            type: "video",
            contentPath: "https://player.vimeo.com/video/511055211",
            azureExerciseVideoId: null,
            isActive: true,
            order: 2,
            exerciseId: "a8d8a1f3-6765-4031-bbb8-cf0baf47f7af",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "0f388b92-99d3-482c-b3af-d4e8e66c5832",
            type: "video",
            contentPath: "https://youtu.be/tdoDo3K5Y_I",
            azureExerciseVideoId: null,
            isActive: true,
            order: 4,
            exerciseId: "a8d8a1f3-6765-4031-bbb8-cf0baf47f7af",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "aee8e5a8-cce0-44b5-8e64-fef58af9ecf8",
            type: "video",
            contentPath: "https://youtu.be/aYG-1YzQIZw",
            azureExerciseVideoId: null,
            isActive: true,
            order: 4,
            exerciseId: "a8d8a1f3-6765-4031-bbb8-cf0baf47f7af",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      }
],
    order: 9,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: true,
  },
  {
    id: '2ac880c8-2c14-4b45-b7aa-d1b0d538a769',
    marathonExerciseId: '00000000-0000-0000-0000-000000000000',
    exerciseName: 'На валике',
    marathonExerciseName: 'На валике',
    description: `<p><strong>На валике</strong></p><p>Уникальное, легкое, расслабляющее и суперэффективное упражнение для снятия спазмов внутренних мышц позвоночника и улучшения статики шеи. Посмотри на картинку, у нас есть мышцы, поддерживающие позвоночник как снаружи, так и изнутри (<strong>д</strong><strong>линная мышца шеи</strong> (лат. Musculus longus colli)). Они соединяют позвонки друг с другом, и когда они переходят в спазматическое состояние, как думаешь, что происходит? Они жёстко фиксируют изгибы позвоночника, которые на самом деле нам нужно выпрямить для улучшения самочувствия и омоложения.</p><p><img src="https://facelift-service.azurewebsites.net/BeautifyManContent/Images/ed57bbb2-825b-484b-ac4b-fb904ccddcce.jpg" style="width: 300px;" class="fr-fic fr-dib"></p><p>Мы не можем дотянуться руками до внутренних мышц позвоночника, чтобы помассировать их. Эти внутренние мышцы можно расслабить только длительным растяжением, не менее 5 минут. Даже в йоге не найти поз, которые могут эффективно помочь им расслабиться. Только лежание на валике может действительно помочь расслабить внутренние мышцы позвоночника и улучшить ситуацию вокруг седьмого шейного позвонка, который обычно с возрастом выпирает.</p><p><strong>Техника проста, но есть меры предосторожности:</strong><br><span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f449.svg);">&nbsp;</span>&nbsp; Это не для беременных.<br><span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f449.svg);">&nbsp;</span>&nbsp; Выход из этого упражнения должен быть ОЧЕНЬ медленным и деликатным, потому что ты растягиваешь позвоночник, поэтому быстрый выход из позы может вызвать люмбаго (резкую простреливающую боль).<br><span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f449.svg);">&nbsp;</span>&nbsp; Если у тебя получится хорошо расслабиться, возможно тебе захочется уснуть прямо на валике. Не стоит этого делать. Лучше повернуться на бок, убрать валик в сторону и так полежать подольше, наслаждаясь приятным расслаблением в спине.</p><p><strong>Техника</strong><br>1. Сделай валик из банного полотенца. Сложи его вдвое по длине, скатай и перевяжи лентой. Ты можешь отрегулировать толщину и твердость валика в соответствии со своими потребностями, смягчив или натянув ленту. Начни с ослабленным вариантом.<br>2. Подготовь место на ровной твердой поверхности, например, на полу, убедитесь, что там нет сквозняка. Постели коврик для йоги или ковер.</p><p><strong>1 действие</strong>. Под поясницей. 5-10 минут.<br>Сядь скрестив ноги, положи валик под поясницу перпендикулярно ей. Ляг на коврик, выпрями ноги и расслабься. Пятки на ширине плеч, руки вытянуты над головой. Расслабляйся и дыши ровно. Расслабляйся в этой позе 5-10 минут.</p><p>Чтобы растяжка была глубже, соедини большие пальцы ног, удерживая пятки на тех же местах, и положи ладони на пол над головой, локти направлены вверх.</p><p>ВАЖНО. Выход из позы очень медленный. Сначала поверни корпус на бок и вытяни валик из-под поясницы. Если ты закончил упражнение, медленно встань на четвереньки и сделай простые прогибы позвоночника, а затем медленно встань на ноги.</p><p><strong>2 действие</strong>. Под серединой спины. 5-10 минут.<br>Из предыдущей позы повернись на бок и перекати валик повыше, к середине спины, снова перпендикулярно позвоночнику, ложись на него и расслабляйся. Для более глубокого растяжения проделай то же соединение пальцев ног и поставь ладони на пол над головой. Расслабляйся 5-10 минут.</p><p>ВАЖНО. Выход из позы очень медленный!</p><p><strong>3 действие.&nbsp;</strong>Под лопатками. 5-10 минут.<br>Из предыдущей позы повернись на бок и перекати валик еще выше, под лопатками, снова перпендикулярно позвоночнику, ложись на него и расслабляйся. Для более глубокого растяжения проделай то же соединение пальцев ног и поставь ладони на пол над головой. Расслабляйся 5-10 минут.</p><p>ВАЖНО. Выход из позы очень медленный!</p><p><strong>4 действие.</strong> Между лопатками вдоль позвоночника 5-10 минут.</p><p>Из предыдущей позы повернись на бок и измени ориентацию валика, на этот раз расположив его под позвоночником, между лопатками. Один конец валика должен находиться в области 7-го шейного позвонка, чтобы шейные позвонки и голова были ниже, чем остальной позвоночник, покоящийся на валике. Расслабься на валике.</p><p>Для более глубокого растяжения и расслабления внутренних мышц позвоночника сделай несколько махов руками в противоположных направлениях. Одна рука вдоль туловища, другая вытягивается прямо над головой, меняй их положение. Попробуй сделать 10 таких движений, затем расслабься в течение 5-10 минут. Сделай то же соединение пальцев ног и ладони на полу для более глубокого растяжения, если ты чувствуешь, что тебе хочется потянуться ещё.</p><p>ВАЖНО. Выход из позы очень медленный. Сначала поверни корпус на бок и вытяни валик из-под спины. Медленно встань четвереньки и сделай простые прогибы &nbsp;позвоночника, затем медленно встань на ноги.</p><p>Расслабление на валике такое глубокое, что с большой вероятностью тебе захочется уснуть прямо на нём. Не давай себе провалиться в сон, особенно если ты только начинаешь практиковать эту технику. Чувствуешь, что засыпаешь? Сделай два глубоких вдоха, медленно повернись на бок, убери валик в сторону и полежи так подольше, наслаждаясь приятным расслаблением в спине.</p><p>&nbsp;Просто помни, что ты очень сильно расслабился, позвонки заняли забытые положения и немного растянулись друг от друга, перестраиваясь в более здоровое состояние позвоночника. Об этом здоровом состоянии позвоночника забывают ткани, окружающие его. Если ты очень быстро вернешься в обычное вертикальное положение, некоторые ткани могут быть немного зажаты позвонками. Это &quot;немного&quot; может вызвать сильную боль, поэтому будь осторожен, когда поднимаешься на ноги. Если ты будешь делать это медленно, осознанно, все ткани найдут там свои правильные физиологичные места, и ты почувствуешь себя просто великолепно!</p><p>Люби свой позвоночник и проживи с ним долгую счастливую жизнь! &nbsp;<span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f609.svg);">&nbsp;</span>&nbsp;</p><p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;"> <a href="https://www.froala.com/wysiwyg-editor?pb=1" title=""></a></p>`,
    duration: 300,
    status: 'NotStarted' as const,
    type: 'Practice' as const,
    exerciseContents: [
      {
            id: "bd90b4ec-7d35-4904-bbb5-e115e39df16f",
            type: "image",
            contentPath: "https://new-facelift-service-b8cta5hpgcgqf8c7.eastus-01.azurewebsites.net/BeautifyManContent/Images/52454076-e1af-4451-8749-d46a91a7f287.jpg",
            azureExerciseVideoId: null,
            isActive: true,
            order: 1,
            exerciseId: "2ac880c8-2c14-4b45-b7aa-d1b0d538a769",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "5b97997e-bf99-41e7-a931-aa3757a86f2a",
            type: "video",
            contentPath: "https://player.vimeo.com/video/645689941",
            azureExerciseVideoId: null,
            isActive: true,
            order: 2,
            exerciseId: "2ac880c8-2c14-4b45-b7aa-d1b0d538a769",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "17cb3251-2c83-4970-8159-70f6a847ab46",
            type: "video",
            contentPath: "https://player.vimeo.com/video/645689930",
            azureExerciseVideoId: null,
            isActive: true,
            order: 3,
            exerciseId: "2ac880c8-2c14-4b45-b7aa-d1b0d538a769",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "84f4e0a6-69ac-4bb6-9ff2-cc0e2d404b98",
            type: "video",
            contentPath: "https://player.vimeo.com/video/645689963",
            azureExerciseVideoId: null,
            isActive: true,
            order: 4,
            exerciseId: "2ac880c8-2c14-4b45-b7aa-d1b0d538a769",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "69355498-824b-4c4e-bafa-58f7a11d7f41",
            type: "video",
            contentPath: "https://player.vimeo.com/video/645689985",
            azureExerciseVideoId: null,
            isActive: true,
            order: 5,
            exerciseId: "2ac880c8-2c14-4b45-b7aa-d1b0d538a769",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "ba6d1fe9-851c-4f90-ae82-60d199684310",
            type: "video",
            contentPath: "https://player.vimeo.com/video/645689953",
            azureExerciseVideoId: null,
            isActive: true,
            order: 6,
            exerciseId: "2ac880c8-2c14-4b45-b7aa-d1b0d538a769",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      },
      {
            id: "5800d1ec-4e0b-4526-a75f-d848d695e490",
            type: "video",
            contentPath: "https://youtu.be/Fb48Sx4Kirc",
            azureExerciseVideoId: null,
            isActive: true,
            order: 7,
            exerciseId: "2ac880c8-2c14-4b45-b7aa-d1b0d538a769",
            createdBy: null,
            modifiedBy: null,
            createdDate: "0001-01-01T00:00:00",
            modifiedDate: null,
            azureVideo: null,
            videoServer: null
      }
],
    order: 10,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: true,
  }
];

export const EXERCISES_MAP = POSTURE_EXERCISES.reduce((acc, exercise) => {
  acc[exercise.id] = exercise;
  return acc;
}, {} as Record<string, Exercise>);
