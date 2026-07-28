"use strict";
(() => {
  // lib/catalogExtended.ts
  var VERIFIED_ON = "2026-07-27";
  var MAINTAINER = "Civic Source Lead \u2014 COMPTON ONE catalog working group";
  var NEXT_REVIEW = "2026-08-26";
  var CITY_MAIN = "(310) 605-5500";
  var MUNI_UTILITIES = "(310) 605-5524";
  var SHERIFF_NON_EMERGENCY = "(310) 605-6500";
  var src = (label, path) => ({
    label: `City of Compton \u2014 ${label}`,
    url: `https://www.comptoncity.org${path}`,
    lastVerifiedAt: VERIFIED_ON
  });
  var SRC_REPORT_INDEX = src("I Want To\u2026 \u203A Report", "/i-want-to/report");
  var SRC_STREET_MAINT = src("Public Works Street Maintenance", "/departments/public-works-street-maintenance");
  var SRC_DIRECTORY = src("City Hall Directory", "/our-city/contact-us/city-hall-directory");
  var SRC_SERVICES = src("Services index", "/services");
  var BASE_PROHIBITED = {
    en: [
      "Names, license plates, or accusations about a specific person",
      "Your full home address in any public description \u2014 the block is enough",
      "Photographs of children or of people\u2019s faces",
      "Immigration status, medical details, or financial account numbers"
    ],
    es: [
      "Nombres, placas de veh\xEDculos o acusaciones contra una persona espec\xEDfica",
      "Su direcci\xF3n completa en una descripci\xF3n p\xFAblica \u2014 la cuadra es suficiente",
      "Fotos de menores o de las caras de las personas",
      "Estatus migratorio, datos m\xE9dicos o n\xFAmeros de cuenta bancaria"
    ]
  };
  var EMERGENCY_COMMON = [
    "anything actively on fire or smoking",
    "a downed or sparking power line",
    "a gas smell",
    "someone injured or in immediate danger"
  ];
  function route(spec) {
    var _a, _b, _c, _d;
    return {
      serviceId: spec.id,
      title: { en: spec.titleEn, es: spec.titleEs },
      category: spec.id,
      domain: spec.domain,
      responsibleEntity: spec.owner,
      noDedicatedCityForm: spec.noForm,
      jurisdiction: spec.jurisdiction,
      intakeMethods: spec.methods.map((m) => {
        var _a2;
        return {
          type: m.type,
          label: { en: m.labelEn, es: m.labelEs },
          destination: m.destination,
          reaches: m.reaches,
          ...m.whenEn ? { appliesWhen: { en: m.whenEn, es: (_a2 = m.whenEs) != null ? _a2 : m.whenEn } } : {},
          verificationState: m.state,
          lastVerifiedAt: VERIFIED_ON
        };
      }),
      triggerExamples: { en: spec.triggersEn, es: spec.triggersEs },
      evidenceRequirements: { en: spec.evidenceEn, es: spec.evidenceEs },
      prohibitedData: {
        en: [...(_a = spec.extraProhibitedEn) != null ? _a : [], ...BASE_PROHIBITED.en],
        es: [...(_b = spec.extraProhibitedEs) != null ? _b : [], ...BASE_PROHIBITED.es]
      },
      emergencyExclusions: [...(_c = spec.emergency) != null ? _c : [], ...EMERGENCY_COMMON],
      expectedConfirmation: spec.confirmEn ? { en: spec.confirmEn, es: (_d = spec.confirmEs) != null ? _d : spec.confirmEn } : null,
      followUpPolicy: {
        residentCheckpoint: { en: spec.checkpointEn, es: spec.checkpointEs },
        // Stays false everywhere: no published City of Compton response time was
        // found for any of these services. A test enforces this.
        officialSlaConfirmed: false
      },
      sourceReferences: spec.sources,
      maintainer: MAINTAINER,
      nextReviewAt: NEXT_REVIEW
    };
  }
  var phone = (destination, reaches, state = "officially_verified", labelEn = "Call", labelEs = "Llame") => ({ type: "phone", labelEn, labelEs, destination, reaches, state });
  var web = (destination, reaches, labelEn = "Official online form", labelEs = "Formulario oficial en l\xEDnea", state = "officially_verified") => ({ type: "web", labelEn, labelEs, destination, reaches, state });
  var EXTENDED_ROUTES = [
    // ------------------------------------------------------------------ 6
    route({
      id: "graffiti",
      titleEn: "Graffiti removal",
      titleEs: "Eliminaci\xF3n de grafiti",
      domain: "public_works",
      owner: "Clean Compton Initiative \u2014 Public Works",
      jurisdiction: "city",
      noForm: false,
      methods: [
        web("https://www.comptoncity.org/i-want-to/report/graffiti", "Clean Compton Initiative"),
        phone(CITY_MAIN, "City of Compton main line")
      ],
      triggersEn: [
        "somebody tagged the wall of the store",
        "there is graffiti on the fence by my house",
        "they spray painted the bus stop again",
        "tagging all over the alley wall",
        "graffiti on the light pole on my corner",
        "someone wrote on my garage door from the alley",
        "the wall by the school is covered in spray paint",
        "markings keep coming back on that building",
        "painted over it and they tagged it again",
        "graffiti on the sidewalk and the curb"
      ],
      triggersEs: [
        "rayaron la pared de la tienda",
        "hay grafiti en la barda junto a mi casa",
        "pintaron otra vez la parada del camion",
        "hay rayones por toda la pared del callejon",
        "grafiti en el poste de luz de mi esquina",
        "alguien pinto mi porton desde el callejon",
        "la pared de la escuela esta llena de pintura",
        "siempre vuelven a rayar ese edificio",
        "lo pintamos y lo volvieron a rayar",
        "hay grafiti en la banqueta y en el borde"
      ],
      evidenceEn: [
        "Photo of the graffiti from a safe distance",
        "Nearest cross streets or the block",
        "Whether the surface is public (wall, pole, sidewalk) or private property",
        "Roughly when it appeared",
        "Whether it has been painted over before"
      ],
      evidenceEs: [
        "Foto del grafiti desde una distancia segura",
        "Calles cercanas o la cuadra",
        "Si la superficie es p\xFAblica (pared, poste, banqueta) o propiedad privada",
        "M\xE1s o menos cu\xE1ndo apareci\xF3",
        "Si ya lo hab\xEDan pintado antes"
      ],
      extraProhibitedEn: ["Any guess about which group or person did it \u2014 report the surface, not the suspect"],
      extraProhibitedEs: ["Cualquier suposici\xF3n sobre qui\xE9n lo hizo \u2014 reporte la superficie, no al sospechoso"],
      emergency: ["a threat against a specific person written on a wall \u2014 report that to the Sheriff"],
      confirmEn: "A service request number for the graffiti removal",
      confirmEs: "Un n\xFAmero de solicitud para la eliminaci\xF3n",
      checkpointEn: "Check in 5 business days; graffiti removal is usually scheduled in batches",
      checkpointEs: "Verifique en 5 d\xEDas h\xE1biles; la limpieza suele programarse por lotes",
      sources: [src("Report Graffiti", "/i-want-to/report/graffiti"), SRC_REPORT_INDEX, SRC_STREET_MAINT]
    }),
    // ------------------------------------------------------------------ 7
    route({
      id: "abandoned_vehicle",
      titleEn: "Abandoned or inoperable vehicle",
      titleEs: "Veh\xEDculo abandonado o inservible",
      domain: "parking",
      owner: "City of Compton \u2014 Parking Services / Code Enforcement",
      jurisdiction: "city",
      noForm: true,
      methods: [
        phone(CITY_MAIN, "City of Compton main line \u2014 ask for Parking Services", "needs_confirmation"),
        phone(
          SHERIFF_NON_EMERGENCY,
          "LA County Sheriff, Compton Station \u2014 non-emergency",
          "officially_verified",
          "Non-emergency Sheriff line",
          "L\xEDnea no urgente del Sheriff"
        )
      ],
      triggersEn: [
        "a car has been parked on my street with flat tires for months",
        "there is an abandoned car on the block",
        "that van has not moved since spring",
        "a wrecked car is sitting in front of my house",
        "someone dumped a car with no plates in the alley",
        "the same car has been there with broken windows",
        "a camper has been parked in the same spot for weeks",
        "junk car taking up the whole space",
        "abandoned truck blocking the driveway apron",
        "a car with expired tags has not moved in months"
      ],
      triggersEs: [
        "hay un carro con llantas ponchadas en mi calle desde hace meses",
        "hay un carro abandonado en la cuadra",
        "esa camioneta no se ha movido desde la primavera",
        "hay un carro chocado enfrente de mi casa",
        "dejaron un carro sin placas en el callejon",
        "el mismo carro sigue ahi con los vidrios rotos",
        "una casa rodante lleva semanas estacionada en el mismo lugar",
        "un carro inservible ocupa todo el lugar",
        "una troca abandonada tapa la entrada",
        "un carro con placas vencidas no se ha movido en meses"
      ],
      evidenceEn: [
        "How long it has been in the same spot",
        "Colour, make and general condition",
        "Nearest cross streets or the block",
        "Whether it is blocking a driveway, hydrant or sidewalk",
        "Whether the plates are expired or missing"
      ],
      evidenceEs: [
        "Cu\xE1nto tiempo lleva en el mismo lugar",
        "Color, marca y condici\xF3n general",
        "Calles cercanas o la cuadra",
        "Si tapa una entrada, un hidrante o la banqueta",
        "Si las placas est\xE1n vencidas o no tiene"
      ],
      extraProhibitedEn: ["The owner\u2019s name, even if you know it", "A photograph that shows the licence plate clearly"],
      extraProhibitedEs: ["El nombre del due\xF1o, aunque lo conozca", "Una foto donde se vea claramente la placa"],
      emergency: ["a vehicle leaking fuel", "anyone living inside a vehicle who needs help \u2014 ask for the homeless outreach team"],
      confirmEn: "A case or service request number, and the date the vehicle was marked",
      confirmEs: "Un n\xFAmero de caso o solicitud, y la fecha en que marcaron el veh\xEDculo",
      checkpointEn: "Check in 10 business days \u2014 abandoned-vehicle abatement runs on a notice period",
      checkpointEs: "Verifique en 10 d\xEDas h\xE1biles \u2014 el proceso incluye un periodo de aviso",
      sources: [SRC_DIRECTORY, src("Parking Services", "/services/parking-services")]
    }),
    // ------------------------------------------------------------------ 8
    route({
      id: "sidewalk",
      titleEn: "Broken or lifted sidewalk",
      titleEs: "Banqueta rota o levantada",
      domain: "public_works",
      owner: "Public Works \u2014 Street Maintenance Division",
      jurisdiction: "city",
      noForm: true,
      methods: [phone(CITY_MAIN, "City of Compton main line \u2014 ask for Street Maintenance")],
      triggersEn: [
        "the sidewalk in front of my house is lifted and my mother trips",
        "the concrete is cracked and uneven",
        "a tree root pushed the sidewalk up",
        "my wheelchair cannot get past the broken pavement",
        "there is a big gap in the sidewalk by the corner",
        "the walkway is broken where the driveway meets it",
        "someone could trip on this sidewalk at night",
        "the sidewalk is crumbling in front of the church",
        "my stroller tips over on that broken section",
        "the curb ramp is broken at the crosswalk"
      ],
      triggersEs: [
        "la banqueta frente a mi casa esta levantada y mi mama se tropieza",
        "el cemento esta agrietado y disparejo",
        "una raiz levanto la banqueta",
        "mi silla de ruedas no pasa por el pavimento roto",
        "hay un hueco grande en la banqueta de la esquina",
        "la banqueta esta rota donde empieza la entrada",
        "alguien se puede tropezar de noche en esa banqueta",
        "la banqueta se esta desmoronando frente a la iglesia",
        "la carriola se voltea en esa parte rota",
        "la rampa de la esquina esta rota"
      ],
      evidenceEn: [
        "Photo showing the height difference \u2014 a shoe or coin for scale helps",
        "Nearest address block or cross streets",
        "Whether it blocks a wheelchair, walker or stroller",
        "Whether a street tree root appears to be the cause",
        "How long it has been like that"
      ],
      evidenceEs: [
        "Foto que muestre la diferencia de altura \u2014 un zapato o moneda ayuda a dar escala",
        "Cuadra o calles cercanas",
        "Si bloquea una silla de ruedas, andadera o carriola",
        "Si parece que la causa es la ra\xEDz de un \xE1rbol",
        "Desde cu\xE1ndo est\xE1 as\xED"
      ],
      emergency: ["anyone already injured by the defect \u2014 get medical help first"],
      confirmEn: "A service request number for the sidewalk inspection",
      confirmEs: "Un n\xFAmero de solicitud para la inspecci\xF3n de la banqueta",
      checkpointEn: "Check in 10 business days; sidewalk repair is usually scheduled after an inspection",
      checkpointEs: "Verifique en 10 d\xEDas h\xE1biles; la reparaci\xF3n se programa despu\xE9s de una inspecci\xF3n",
      sources: [SRC_STREET_MAINT, SRC_DIRECTORY]
    }),
    // ------------------------------------------------------------------ 9
    route({
      id: "street_tree",
      titleEn: "Street tree problem",
      titleEs: "Problema con un \xE1rbol de la calle",
      domain: "public_works",
      owner: "Public Works \u2014 Street Maintenance Division",
      jurisdiction: "city",
      noForm: true,
      methods: [phone(CITY_MAIN, "City of Compton main line \u2014 ask for Street Maintenance")],
      triggersEn: [
        "a big branch is hanging over the driveway and looks like it will fall",
        "the tree in the parkway is dead",
        "branches are blocking the stop sign",
        "roots from the city tree are lifting my walkway",
        "the tree needs trimming, it covers the streetlight",
        "a limb came down in the wind and is in the street",
        "the tree in front is leaning badly",
        "low branches hit the bus and the trucks",
        "that dead tree drops branches every time it is windy",
        "the tree is blocking the street light on my corner"
      ],
      triggersEs: [
        "una rama grande cuelga sobre la entrada y parece que se va a caer",
        "el arbol de la banqueta esta seco",
        "las ramas tapan el letrero de alto",
        "las raices del arbol de la ciudad levantan mi banqueta",
        "hay que podar el arbol, tapa la luz de la calle",
        "se cayo una rama con el viento y esta en la calle",
        "el arbol de enfrente esta muy inclinado",
        "las ramas bajas le pegan al camion",
        "ese arbol seco tira ramas cada vez que hace viento",
        "el arbol tapa la luz de la calle en mi esquina"
      ],
      evidenceEn: [
        "Photo of the tree and the hazard",
        "Nearest cross streets or the block",
        "Whether the tree is in the parkway strip (city) or inside a private yard",
        "What it is blocking: a sign, a light, the sidewalk, a driveway",
        "Whether a limb has already fallen"
      ],
      evidenceEs: [
        "Foto del \xE1rbol y del peligro",
        "Calles cercanas o la cuadra",
        "Si el \xE1rbol est\xE1 en la franja de la banqueta (ciudad) o dentro de un patio privado",
        "Qu\xE9 est\xE1 tapando: un letrero, una luz, la banqueta, una entrada",
        "Si ya se cay\xF3 una rama"
      ],
      emergency: ["a tree or limb touching a power line", "a tree already down across the roadway"],
      confirmEn: "A service request number for the tree inspection or trim",
      confirmEs: "Un n\xFAmero de solicitud para la inspecci\xF3n o poda",
      checkpointEn: "Check in 10 business days; trimming is usually scheduled by route",
      checkpointEs: "Verifique en 10 d\xEDas h\xE1biles; la poda se programa por ruta",
      sources: [SRC_STREET_MAINT, SRC_DIRECTORY]
    }),
    // ------------------------------------------------------------------ 10
    route({
      id: "traffic_sign_signal",
      titleEn: "Traffic signal, sign or street marking",
      titleEs: "Sem\xE1foro, se\xF1al o marca vial",
      domain: "public_works",
      owner: "Public Works \u2014 Street Maintenance Division",
      jurisdiction: "city",
      noForm: true,
      methods: [
        phone(CITY_MAIN, "City of Compton main line \u2014 ask for Street Maintenance"),
        phone(
          SHERIFF_NON_EMERGENCY,
          "LA County Sheriff, Compton Station \u2014 non-emergency",
          "officially_verified",
          "If a signal is dark and traffic is unsafe right now",
          "Si un sem\xE1foro est\xE1 apagado y el tr\xE1fico es peligroso ahora"
        )
      ],
      triggersEn: [
        "the stop sign at my corner got knocked down",
        "the traffic light keeps flashing red",
        "the crosswalk paint is completely worn off",
        "the signal never changes for our direction",
        "a street name sign is missing at the corner",
        "the arrow light stopped working",
        "the school zone sign is bent and facing the wrong way",
        "the speed limit sign got hit",
        "the crossing signal button does not work",
        "the lane lines are gone after they repaved"
      ],
      triggersEs: [
        "tumbaron el letrero de alto de mi esquina",
        "el semaforo se queda en rojo intermitente",
        "ya no se ve la pintura del cruce peatonal",
        "el semaforo nunca cambia para nuestro lado",
        "falta el letrero con el nombre de la calle",
        "la flecha del semaforo dejo de funcionar",
        "el letrero de la zona escolar esta doblado",
        "chocaron el letrero de limite de velocidad",
        "el boton para cruzar no sirve",
        "no quedaron las lineas de los carriles despues de repavimentar"
      ],
      evidenceEn: [
        "Exact intersection or the nearest two cross streets",
        "What is wrong: dark, flashing, bent, missing, faded",
        "Which direction of travel it affects",
        "Time of day you noticed it",
        "Photo if it is safe to take one from the sidewalk"
      ],
      evidenceEs: [
        "Cruce exacto o las dos calles m\xE1s cercanas",
        "Qu\xE9 tiene: apagado, intermitente, doblado, falta, borrado",
        "A qu\xE9 sentido de circulaci\xF3n afecta",
        "A qu\xE9 hora lo not\xF3",
        "Foto si puede tomarla con seguridad desde la banqueta"
      ],
      emergency: ["a signal completely dark at a busy intersection right now", "a downed sign with exposed wiring"],
      confirmEn: "A service request number for the signal or sign repair",
      confirmEs: "Un n\xFAmero de solicitud para la reparaci\xF3n",
      checkpointEn: "Check in 3 business days \u2014 traffic control is usually prioritised",
      checkpointEs: "Verifique en 3 d\xEDas h\xE1biles \u2014 el control de tr\xE1fico suele priorizarse",
      sources: [SRC_STREET_MAINT, SRC_DIRECTORY]
    }),
    // ------------------------------------------------------------------ 11
    route({
      id: "storm_drain",
      titleEn: "Storm drain or street flooding",
      titleEs: "Alcantarilla pluvial o inundaci\xF3n en la calle",
      domain: "water",
      owner: "Public Works \u2014 Street Maintenance Division",
      jurisdiction: "city",
      noForm: true,
      methods: [phone(CITY_MAIN, "City of Compton main line \u2014 ask for Street Maintenance")],
      triggersEn: [
        "the storm drain is packed with leaves and trash",
        "the street floods every time it rains",
        "water pools at the corner and never drains",
        "the catch basin is blocked",
        "the gutter is full of mud and the water backs up",
        "rain water comes up over the curb into the yard",
        "the drain grate is broken and missing bars",
        "that corner turns into a lake in winter",
        "the storm drain smells and is full of garbage",
        "water sits in the street for days after it rains"
      ],
      triggersEs: [
        "la alcantarilla esta llena de hojas y basura",
        "la calle se inunda cada vez que llueve",
        "el agua se junta en la esquina y no baja",
        "la coladera pluvial esta tapada",
        "la cuneta esta llena de lodo y el agua se regresa",
        "el agua de lluvia se pasa al patio",
        "la rejilla del drenaje esta rota y le faltan barras",
        "esa esquina se hace laguna en invierno",
        "la alcantarilla huele y esta llena de basura",
        "el agua se queda dias en la calle despues de llover"
      ],
      evidenceEn: [
        "Photo of the drain or the standing water",
        "Nearest cross streets",
        "Whether it happens only when it rains or all the time",
        "Whether water reaches a driveway, garage or doorway",
        "How long the water usually stays"
      ],
      evidenceEs: [
        "Foto del drenaje o del agua estancada",
        "Calles m\xE1s cercanas",
        "Si pasa solo cuando llueve o todo el tiempo",
        "Si el agua llega a una entrada, cochera o puerta",
        "Cu\xE1nto tiempo suele quedarse el agua"
      ],
      emergency: ["water entering a home right now", "a missing drain cover a child could fall into"],
      confirmEn: "A service request number for the storm drain cleaning or inspection",
      confirmEs: "Un n\xFAmero de solicitud para la limpieza o inspecci\xF3n",
      checkpointEn: "Check in 5 business days, and before the next forecast rain",
      checkpointEs: "Verifique en 5 d\xEDas h\xE1biles, y antes de la pr\xF3xima lluvia pronosticada",
      sources: [SRC_STREET_MAINT, SRC_DIRECTORY]
    }),
    // ------------------------------------------------------------------ 12
    route({
      id: "bulky_item",
      titleEn: "Bulky item or appliance pickup",
      titleEs: "Recolecci\xF3n de art\xEDculos voluminosos",
      domain: "waste",
      owner: "Municipal Utilities \u2014 Waste Division",
      jurisdiction: "city",
      noForm: true,
      methods: [
        phone(MUNI_UTILITIES, "Municipal Utilities customer service \u2014 Waste Division"),
        web(
          "https://www.comptoncity.org/services/waste-and-recycling",
          "Waste and Recycling information",
          "Waste and recycling information page",
          "P\xE1gina de basura y reciclaje"
        )
      ],
      triggersEn: [
        "how do I get rid of an old mattress the right way",
        "I need them to pick up a broken refrigerator",
        "can someone haul away my old couch",
        "I have a washing machine to get rid of",
        "do I need an appointment for a bulky pickup",
        "moving out and I have furniture the truck will not take",
        "the trash truck will not take my old table",
        "I want to put out a mattress legally",
        "how much does it cost to have a big item picked up",
        "I have an old tv and a dresser to dispose of"
      ],
      triggersEs: [
        "como me deshago de un colchon viejo correctamente",
        "necesito que recojan un refrigerador descompuesto",
        "pueden llevarse mi sillon viejo",
        "tengo una lavadora que quiero desechar",
        "necesito cita para recoleccion de articulos grandes",
        "me estoy mudando y tengo muebles que el camion no lleva",
        "el camion de basura no se lleva mi mesa vieja",
        "quiero sacar un colchon de forma legal",
        "cuanto cuesta que recojan un articulo grande",
        "tengo una tele vieja y un tocador que desechar"
      ],
      evidenceEn: [
        "What the items are and roughly how many",
        "Your service address and regular collection day",
        "Whether the items contain refrigerant (fridge, freezer, AC unit)",
        "Where you can place them \u2014 kerb, alley, or behind a gate",
        "Whether you need help moving them out"
      ],
      evidenceEs: [
        "Qu\xE9 art\xEDculos son y aproximadamente cu\xE1ntos",
        "Su direcci\xF3n de servicio y d\xEDa normal de recolecci\xF3n",
        "Si los art\xEDculos tienen refrigerante (refrigerador, congelador, aire acondicionado)",
        "D\xF3nde puede colocarlos \u2014 banqueta, callej\xF3n o detr\xE1s de un port\xF3n",
        "Si necesita ayuda para sacarlos"
      ],
      extraProhibitedEn: ["Do not put the items out before you have an appointment \u2014 that can become an illegal dumping citation"],
      extraProhibitedEs: ["No saque los art\xEDculos antes de tener cita \u2014 eso puede convertirse en una multa por tiradero ilegal"],
      confirmEn: "The appointment date and a confirmation number",
      confirmEs: "La fecha de la cita y un n\xFAmero de confirmaci\xF3n",
      checkpointEn: "Check the day before your appointment, and the day after if it was missed",
      checkpointEs: "Verifique el d\xEDa antes de su cita, y el d\xEDa despu\xE9s si no pasaron",
      sources: [
        src("Waste and Recycling", "/services/waste-and-recycling"),
        src("Municipal Utilities \u2014 Waste Division", "/departments/municipal-utilities/waste-division")
      ]
    }),
    // ------------------------------------------------------------------ 13
    route({
      id: "recycling_ewaste",
      titleEn: "Recycling, e-waste and hazardous items",
      titleEs: "Reciclaje, e-waste y materiales peligrosos",
      domain: "waste",
      owner: "Municipal Utilities \u2014 Waste Division",
      jurisdiction: "city",
      noForm: false,
      methods: [
        web("https://www.comptoncity.org/i-want-to/learn-about/recycling-and-e-waste", "Recycling and e-waste guidance"),
        phone(MUNI_UTILITIES, "Municipal Utilities customer service \u2014 Waste Division")
      ],
      triggersEn: [
        "where do I take an old computer",
        "how do I get rid of paint the right way",
        "what do I do with old batteries",
        "can I recycle a broken tv",
        "where does e-waste go around here",
        "I have motor oil I need to dispose of",
        "what goes in the blue bin",
        "my recycling cart is cracked and I need a new one",
        "how do I recycle cardboard from my business",
        "where can I take old tires"
      ],
      triggersEs: [
        "donde llevo una computadora vieja",
        "como me deshago de pintura correctamente",
        "que hago con las pilas viejas",
        "puedo reciclar una tele rota",
        "donde se lleva el e-waste por aqui",
        "tengo aceite de motor que necesito desechar",
        "que va en el bote azul",
        "mi bote de reciclaje esta roto y necesito otro",
        "como reciclo carton de mi negocio",
        "donde puedo llevar llantas viejas"
      ],
      evidenceEn: [
        "What the item is and roughly how much of it",
        "Whether it is household or business waste",
        "Your service address",
        "Whether you can transport it yourself"
      ],
      evidenceEs: [
        "Qu\xE9 es el art\xEDculo y aproximadamente cu\xE1nto",
        "Si es residuo dom\xE9stico o de negocio",
        "Su direcci\xF3n de servicio",
        "Si puede transportarlo usted mismo"
      ],
      extraProhibitedEn: ["Never put paint, oil, batteries or electronics in the regular bin, and never in the alley"],
      extraProhibitedEs: ["Nunca ponga pintura, aceite, pilas o electr\xF3nicos en el bote normal, ni en el callej\xF3n"],
      emergency: ["a leaking or unlabelled chemical container"],
      confirmEn: "The drop-off location, hours, and any confirmation number you are given",
      confirmEs: "El lugar de entrega, el horario y cualquier n\xFAmero de confirmaci\xF3n que le den",
      checkpointEn: "Check before you travel \u2014 drop-off events and hours change",
      checkpointEs: "Verifique antes de ir \u2014 los horarios y eventos cambian",
      sources: [src("Recycling and E-Waste", "/i-want-to/learn-about/recycling-and-e-waste"), SRC_SERVICES]
    }),
    // ------------------------------------------------------------------ 14
    route({
      id: "animal_control",
      titleEn: "Animal control",
      titleEs: "Control de animales",
      domain: "animals",
      owner: "City of Compton \u2014 Animal Control",
      jurisdiction: "city",
      noForm: false,
      methods: [
        web("https://www.comptoncity.org/i-want-to/report/animal-control", "City of Compton animal control reporting"),
        web(
          "https://www.comptoncity.org/services/animal-services",
          "Animal services information",
          "Animal services information page",
          "P\xE1gina de servicios para animales"
        ),
        phone(CITY_MAIN, "City of Compton main line")
      ],
      triggersEn: [
        "there is a stray dog living under my porch",
        "a pack of loose dogs is on the block again",
        "someone left a dog tied up with no water",
        "there is a dead animal in the street",
        "a dog keeps getting out and chasing kids",
        "i found a litter of kittens in the alley",
        "the neighbor has way too many animals",
        "a coyote has been coming through the yard at night",
        "a dog bit someone on our street",
        "there is an injured cat in the parking lot"
      ],
      triggersEs: [
        "hay un perro callejero viviendo debajo del porche",
        "hay varios perros sueltos otra vez en la cuadra",
        "dejaron un perro amarrado sin agua",
        "hay un animal muerto en la calle",
        "un perro se sale y persigue a los ninos",
        "encontre unos gatitos en el callejon",
        "el vecino tiene demasiados animales",
        "un coyote pasa por el patio en la noche",
        "un perro mordio a alguien en nuestra calle",
        "hay un gato herido en el estacionamiento"
      ],
      evidenceEn: [
        "Where the animal is, and whether it is contained",
        "Description: size, colour, collar or tags",
        "Whether anyone has been bitten or scratched",
        "How long it has been there",
        "Whether the animal appears injured or sick"
      ],
      evidenceEs: [
        "D\xF3nde est\xE1 el animal y si est\xE1 encerrado",
        "Descripci\xF3n: tama\xF1o, color, collar o placas",
        "Si alguien fue mordido o rasgu\xF1ado",
        "Cu\xE1nto tiempo lleva ah\xED",
        "Si el animal parece herido o enfermo"
      ],
      extraProhibitedEn: ["Do not approach, corner or try to catch a loose or injured animal yourself"],
      extraProhibitedEs: ["No se acerque, no acorrale ni intente atrapar usted mismo a un animal suelto o herido"],
      emergency: ["an animal actively attacking a person", "a bite that broke the skin \u2014 get medical care and call the Sheriff"],
      confirmEn: "A service request number, and the date an officer is expected",
      confirmEs: "Un n\xFAmero de solicitud y la fecha en que se espera un oficial",
      checkpointEn: "Check in 2 business days; call again the same day if the animal is aggressive",
      checkpointEs: "Verifique en 2 d\xEDas h\xE1biles; vuelva a llamar el mismo d\xEDa si el animal es agresivo",
      sources: [
        src("Report Animal Control", "/i-want-to/report/animal-control"),
        src("Animal Services", "/services/animal-services"),
        SRC_REPORT_INDEX
      ]
    }),
    // ------------------------------------------------------------------ 15
    route({
      id: "code_violation",
      titleEn: "Property or code violation",
      titleEs: "Violaci\xF3n de c\xF3digo o de propiedad",
      domain: "code_enforcement",
      owner: "Building and Safety \u2014 Code Enforcement",
      jurisdiction: "city",
      noForm: false,
      methods: [
        web("https://www.comptoncity.org/i-want-to/report/code-violations", "Code Enforcement"),
        phone(CITY_MAIN, "City of Compton main line \u2014 ask for Code Enforcement")
      ],
      triggersEn: [
        "the empty lot next door is overgrown and full of junk",
        "people are living in a shed in the backyard",
        "that building has been vacant and open for months",
        "someone is running a business out of a house all night",
        "the house next door has trash piled up in the yard",
        "they built an addition with no permit",
        "a property is attracting rats because of the mess",
        "there is an unpermitted unit in the garage",
        "the fence has been down for a year and dogs get out",
        "that vacant house has people going in and out"
      ],
      triggersEs: [
        "el lote de al lado esta lleno de maleza y cochinero",
        "hay gente viviendo en un cuartito del patio",
        "ese edificio lleva meses vacio y abierto",
        "alguien tiene un negocio en una casa toda la noche",
        "la casa de al lado tiene basura amontonada en el patio",
        "construyeron un cuarto sin permiso",
        "una propiedad esta atrayendo ratas por el tiradero",
        "hay un departamento sin permiso en la cochera",
        "la barda lleva un ano caida y los perros se salen",
        "esa casa vacia tiene gente entrando y saliendo"
      ],
      evidenceEn: [
        "The address or the block and which side of the street",
        "What the condition is, in plain description",
        "How long it has been like that",
        "Photos taken from the public sidewalk only",
        "Whether you have reported it before"
      ],
      evidenceEs: [
        "La direcci\xF3n o la cuadra y de qu\xE9 lado de la calle",
        "Cu\xE1l es la condici\xF3n, descrita de forma sencilla",
        "Desde cu\xE1ndo est\xE1 as\xED",
        "Fotos tomadas solo desde la banqueta p\xFAblica",
        "Si ya lo hab\xEDa reportado antes"
      ],
      extraProhibitedEn: [
        "Never enter, photograph inside, or approach a private property to document it",
        "Do not name the residents or make claims about who lives there"
      ],
      extraProhibitedEs: [
        "Nunca entre, fotograf\xEDe adentro ni se acerque a una propiedad privada para documentarla",
        "No mencione a los residentes ni afirme qui\xE9n vive ah\xED"
      ],
      emergency: ["a structure that looks like it could collapse", "anyone trapped or in danger inside a vacant building"],
      confirmEn: "A code enforcement case number and the assigned inspector\u2019s district",
      confirmEs: "Un n\xFAmero de caso de c\xF3digo y el distrito del inspector asignado",
      checkpointEn: "Check in 10 business days \u2014 code cases run on notice and compliance periods",
      checkpointEs: "Verifique en 10 d\xEDas h\xE1biles \u2014 los casos de c\xF3digo tienen periodos de aviso y cumplimiento",
      sources: [
        src("Report a Violation", "/i-want-to/report/code-violations"),
        src("Code Enforcement", "/departments/building-and-safety/code-enforcement")
      ]
    }),
    // ------------------------------------------------------------------ 16
    route({
      id: "housing_help",
      titleEn: "Housing help and rent assistance",
      titleEs: "Ayuda de vivienda y renta",
      domain: "housing",
      owner: "Compton Housing Authority",
      jurisdiction: "city",
      noForm: false,
      methods: [
        web("https://www.comptoncity.org/departments/housing-authority", "Compton Housing Authority"),
        phone(CITY_MAIN, "City of Compton main line \u2014 ask for the Housing Authority")
      ],
      triggersEn: [
        "I want to apply for help paying for a new roof",
        "how do I get on the section 8 list",
        "my landlord will not fix the heater",
        "I am behind on rent and about to be evicted",
        "is there any rent assistance for seniors",
        "my apartment has mold and the manager ignores me",
        "I need help with a housing voucher",
        "the landlord raised the rent way too much",
        "my building has no hot water for weeks",
        "where do I go for help staying in my home"
      ],
      triggersEs: [
        "quiero solicitar ayuda para pagar un techo nuevo",
        "como me apunto en la lista de la seccion 8",
        "el casero no arregla el calenton",
        "estoy atrasado con la renta y me quieren desalojar",
        "hay ayuda de renta para personas mayores",
        "mi departamento tiene moho y el manager no hace nada",
        "necesito ayuda con un vale de vivienda",
        "el casero subio muchisimo la renta",
        "mi edificio lleva semanas sin agua caliente",
        "a donde voy para que me ayuden a quedarme en mi casa"
      ],
      evidenceEn: [
        "Whether you rent or own",
        "How many people live in the household",
        "What has already been reported to the landlord, and when",
        "Any written notice you have received",
        "Whether anyone in the home is a senior, disabled, or a child"
      ],
      evidenceEs: [
        "Si renta o es due\xF1o",
        "Cu\xE1ntas personas viven en el hogar",
        "Qu\xE9 ya le report\xF3 al casero y cu\xE1ndo",
        "Cualquier aviso escrito que haya recibido",
        "Si en el hogar hay personas mayores, con discapacidad o menores"
      ],
      extraProhibitedEn: [
        "This app cannot give legal advice, and it is not a legal-aid service",
        "Do not send immigration documents or a social security number to anyone who asks over the phone"
      ],
      extraProhibitedEs: [
        "Esta aplicaci\xF3n no da asesor\xEDa legal ni es un servicio de ayuda legal",
        "No env\xEDe documentos migratorios ni su n\xFAmero de seguro social a quien se lo pida por tel\xE9fono"
      ],
      emergency: ["a lockout, a shut-off utility, or an eviction happening today \u2014 seek legal aid immediately"],
      confirmEn: "The name of the programme, your application or case number, and the next deadline",
      confirmEs: "El nombre del programa, su n\xFAmero de solicitud o caso, y la pr\xF3xima fecha l\xEDmite",
      checkpointEn: "Check in 5 business days, and note any deadline they give you",
      checkpointEs: "Verifique en 5 d\xEDas h\xE1biles y anote cualquier fecha l\xEDmite que le den",
      sources: [
        src("Housing Authority", "/departments/housing-authority"),
        src("Housing Authority \u2014 Programs", "/departments/housing-authority/programs")
      ]
    }),
    // ------------------------------------------------------------------ 17
    route({
      id: "parking_citation",
      titleEn: "Parking ticket \u2014 pay or appeal",
      titleEs: "Multa de estacionamiento \u2014 pagar o apelar",
      domain: "parking",
      owner: "City of Compton \u2014 Parking Services",
      jurisdiction: "city",
      noForm: false,
      methods: [
        web("https://www.comptoncity.org/i-want-to/pay/parking-citations", "Parking citation payment"),
        web(
          "https://www.comptoncity.org/i-want-to/learn-about/appeal-a-parking-ticket",
          "Parking ticket appeal information",
          "How to appeal a citation",
          "C\xF3mo apelar una multa"
        ),
        phone(CITY_MAIN, "City of Compton main line \u2014 ask for Parking Services")
      ],
      triggersEn: [
        "I got a parking ticket and I do not understand what it says",
        "how do I fight a parking citation",
        "where do I pay a parking ticket",
        "I got a ticket on street sweeping day but the signs are missing",
        "my ticket says a code I cannot find",
        "can I get an extension on a parking fine",
        "I was ticketed in front of my own house",
        "the citation has the wrong plate on it",
        "how long do I have to appeal a ticket",
        "the fine doubled and I never got the first notice"
      ],
      triggersEs: [
        "me llego una multa de estacionamiento y no entiendo que dice",
        "como peleo una multa de estacionamiento",
        "donde pago una multa de estacionamiento",
        "me multaron el dia de barrido pero no hay letreros",
        "mi multa tiene un codigo que no encuentro",
        "puedo pedir una prorroga para una multa",
        "me multaron enfrente de mi propia casa",
        "la multa tiene la placa equivocada",
        "cuanto tiempo tengo para apelar una multa",
        "la multa se duplico y nunca recibi el primer aviso"
      ],
      evidenceEn: [
        "The citation number and the date issued",
        "The exact location written on the citation",
        "Photos of the signs, kerb markings, or lack of them, taken the same week",
        "Anything showing the vehicle was permitted to be there",
        "The appeal deadline printed on the citation"
      ],
      evidenceEs: [
        "El n\xFAmero de la multa y la fecha",
        "La ubicaci\xF3n exacta escrita en la multa",
        "Fotos de los letreros o marcas de la banqueta, o de que no hay, tomadas la misma semana",
        "Cualquier prueba de que el veh\xEDculo pod\xEDa estar ah\xED",
        "La fecha l\xEDmite de apelaci\xF3n impresa en la multa"
      ],
      extraProhibitedEn: ["Never send a payment to a phone number or link that contacted you first \u2014 check the citation"],
      extraProhibitedEs: ["Nunca pague a un n\xFAmero o enlace que lo contact\xF3 primero \u2014 revise la multa"],
      confirmEn: "A payment receipt or an appeal reference number, and the decision deadline",
      confirmEs: "Un recibo de pago o n\xFAmero de apelaci\xF3n, y la fecha de la decisi\xF3n",
      checkpointEn: "Check before the deadline printed on your citation \u2014 appeal windows are short",
      checkpointEs: "Verifique antes de la fecha en su multa \u2014 los plazos de apelaci\xF3n son cortos",
      sources: [
        src("Pay Parking Citations", "/i-want-to/pay/parking-citations"),
        src("Appeal a Parking Ticket", "/i-want-to/learn-about/appeal-a-parking-ticket"),
        src("Parking Ordinance", "/i-want-to/learn-about/parking-ordinance")
      ]
    }),
    // ------------------------------------------------------------------ 18
    route({
      id: "utility_billing",
      titleEn: "Water bill or utility account",
      titleEs: "Recibo de agua o cuenta de servicios",
      domain: "utilities_billing",
      owner: "Municipal Utilities \u2014 Customer Service",
      jurisdiction: "city",
      noForm: false,
      methods: [
        web("https://www.comptoncity.org/i-want-to/pay/utility-bills", "Utility bill payment"),
        phone(MUNI_UTILITIES, "Municipal Utilities customer service"),
        web(
          "https://www.comptoncity.org/i-want-to/get/utility-services",
          "Start or stop utility service",
          "Start, stop or transfer service",
          "Iniciar, terminar o transferir servicio"
        )
      ],
      triggersEn: [
        "my water bill tripled and I do not know why",
        "how do I set up water service at a new place",
        "I need a payment plan for my utility bill",
        "they are threatening to shut off my water",
        "I never got my bill this month",
        "how do I transfer service when I move",
        "my bill shows usage from when the house was empty",
        "is there a discount for seniors on the water bill",
        "I paid but the account still shows a balance",
        "how do I dispute a charge on my utility account"
      ],
      triggersEs: [
        "mi recibo de agua se triplico y no se por que",
        "como doy de alta el servicio de agua en un lugar nuevo",
        "necesito un plan de pagos para mi recibo",
        "me estan amenazando con cortarme el agua",
        "no me llego el recibo este mes",
        "como transfiero el servicio cuando me mude",
        "mi recibo muestra consumo de cuando la casa estaba vacia",
        "hay descuento para personas mayores en el agua",
        "ya pague pero la cuenta sigue con saldo",
        "como disputo un cargo en mi cuenta de servicios"
      ],
      evidenceEn: [
        "Your account number from a recent bill",
        "The service address",
        "The amount and the billing period in question",
        "Any payment confirmation you already have",
        "Whether a shut-off notice has been issued and its date"
      ],
      evidenceEs: [
        "Su n\xFAmero de cuenta de un recibo reciente",
        "La direcci\xF3n del servicio",
        "El monto y el periodo de facturaci\xF3n en cuesti\xF3n",
        "Cualquier comprobante de pago que ya tenga",
        "Si ya le dieron aviso de corte y de qu\xE9 fecha"
      ],
      extraProhibitedEn: [
        "Never give a card number to someone who called you \u2014 call the number on your own bill",
        "Do not share your full account number in a public post or message"
      ],
      extraProhibitedEs: [
        "Nunca d\xE9 un n\xFAmero de tarjeta a quien lo llam\xF3 \u2014 marque el n\xFAmero de su propio recibo",
        "No comparta su n\xFAmero de cuenta completo en publicaciones o mensajes p\xFAblicos"
      ],
      emergency: ["a shut-off scheduled within 24 hours in a home with a medical device or an infant"],
      confirmEn: "A confirmation number, the name of the representative, and any arrangement date agreed",
      confirmEs: "Un n\xFAmero de confirmaci\xF3n, el nombre del representante y cualquier fecha acordada",
      checkpointEn: "Check in 3 business days, and before any shut-off date you were given",
      checkpointEs: "Verifique en 3 d\xEDas h\xE1biles y antes de cualquier fecha de corte que le dieron",
      sources: [
        src("Pay Utility Bills", "/i-want-to/pay/utility-bills"),
        src("Get Utility Services", "/i-want-to/get/utility-services"),
        src("Municipal Utilities", "/departments/municipal-utilities")
      ]
    }),
    // ------------------------------------------------------------------ 19
    route({
      id: "business_permit",
      titleEn: "Business licence or building permit",
      titleEs: "Licencia de negocio o permiso de construcci\xF3n",
      domain: "permits",
      owner: "City of Compton \u2014 Business Licence / Building and Safety",
      jurisdiction: "city",
      noForm: false,
      methods: [
        web("https://www.comptoncity.org/i-want-to/apply-for/business-licenses", "Business licence applications"),
        web(
          "https://www.comptoncity.org/i-want-to/apply-for/building-permits",
          "Building permit applications",
          "Building permits",
          "Permisos de construcci\xF3n"
        ),
        phone(CITY_MAIN, "City of Compton main line")
      ],
      triggersEn: [
        "I need a permit to put a taco stand outside my shop",
        "how do I get a business license in compton",
        "do I need a permit to add a room",
        "what does it cost to renew my business license",
        "I want to open a small shop, where do I start",
        "do I need a permit for a food truck",
        "my contractor says I need a building permit",
        "how do I get a film permit for my block",
        "what permits do I need for a home business",
        "I want to build an ADU in the back"
      ],
      triggersEs: [
        "necesito un permiso para poner un puesto de tacos afuera de mi negocio",
        "como saco una licencia de negocio en compton",
        "necesito permiso para agregar un cuarto",
        "cuanto cuesta renovar mi licencia de negocio",
        "quiero abrir un negocio pequeno, por donde empiezo",
        "necesito permiso para un food truck",
        "mi contratista dice que necesito un permiso de construccion",
        "como saco un permiso de filmacion para mi cuadra",
        "que permisos necesito para un negocio en casa",
        "quiero construir un cuarto adicional atras"
      ],
      evidenceEn: [
        "What exactly you plan to do, in one sentence",
        "The address where it will happen",
        "Whether you own or rent the property",
        "Any plans, drawings or contractor information you have",
        "The date you hope to start"
      ],
      evidenceEs: [
        "Qu\xE9 planea hacer exactamente, en una frase",
        "La direcci\xF3n donde ser\xE1",
        "Si es due\xF1o o renta la propiedad",
        "Cualquier plano, dibujo o informaci\xF3n del contratista",
        "La fecha en que espera empezar"
      ],
      extraProhibitedEn: ["This app cannot tell you whether a permit is required \u2014 only the City can"],
      extraProhibitedEs: ["Esta aplicaci\xF3n no puede decirle si necesita permiso \u2014 solo la Ciudad puede"],
      confirmEn: "The application number, the fee quoted, and the next required step",
      confirmEs: "El n\xFAmero de solicitud, la cuota indicada y el siguiente paso",
      checkpointEn: "Check in 5 business days, and before any expiry date you are given",
      checkpointEs: "Verifique en 5 d\xEDas h\xE1biles y antes de cualquier fecha de vencimiento",
      sources: [
        src("Apply for Business Licenses", "/i-want-to/apply-for/business-licenses"),
        src("Apply for Building Permits", "/i-want-to/apply-for/building-permits"),
        src("Licenses and Permits", "/services/licenses-and-permits")
      ]
    }),
    // ------------------------------------------------------------------ 20
    route({
      id: "public_records",
      titleEn: "Public records and city documents",
      titleEs: "Registros p\xFAblicos y documentos de la ciudad",
      domain: "records",
      owner: "Office of the City Clerk",
      jurisdiction: "city",
      noForm: false,
      methods: [
        web("https://www.comptoncity.org/i-want-to/get/request-public-records", "Public records request"),
        web(
          "https://www.comptoncity.org/departments/city-clerk/public-records-request",
          "City Clerk public records request",
          "City Clerk records request page",
          "P\xE1gina de solicitud del Secretario Municipal"
        ),
        phone(CITY_MAIN, "City of Compton main line \u2014 ask for the City Clerk")
      ],
      triggersEn: [
        "how do I get a copy of a report from last year",
        "I need a copy of a city document",
        "where do I request public records",
        "when is the next city council meeting and can I speak",
        "I want to see the city budget",
        "how do I get the minutes from a council meeting",
        "I need documentation about a property from the city",
        "where can I find the municipal code",
        "how do I request records about a code case",
        "I need a copy of a permit that was issued"
      ],
      triggersEs: [
        "como consigo una copia de un reporte del ano pasado",
        "necesito una copia de un documento de la ciudad",
        "donde solicito registros publicos",
        "cuando es la proxima junta del consejo y puedo hablar",
        "quiero ver el presupuesto de la ciudad",
        "como consigo las minutas de una junta del consejo",
        "necesito documentacion de la ciudad sobre una propiedad",
        "donde encuentro el codigo municipal",
        "como solicito registros de un caso de codigo",
        "necesito copia de un permiso que emitieron"
      ],
      evidenceEn: [
        "Exactly which record you want, and the date range",
        "Any case, permit or address the record relates to",
        "Why you need it \u2014 helpful, though not required",
        "How you want to receive it: email, pickup, or mail"
      ],
      evidenceEs: [
        "Exactamente qu\xE9 registro quiere y el rango de fechas",
        "Cualquier caso, permiso o direcci\xF3n relacionado",
        "Para qu\xE9 lo necesita \u2014 ayuda, aunque no es obligatorio",
        "C\xF3mo quiere recibirlo: correo electr\xF3nico, en persona o por correo"
      ],
      extraProhibitedEn: ["Do not include another person\u2019s private information in your request"],
      extraProhibitedEs: ["No incluya informaci\xF3n privada de otra persona en su solicitud"],
      confirmEn: "A request number and the date the City must respond by",
      confirmEs: "Un n\xFAmero de solicitud y la fecha en que la Ciudad debe responder",
      checkpointEn: "Check on the response date the Clerk gives you \u2014 records requests run on a statutory clock",
      checkpointEs: "Verifique en la fecha de respuesta que le d\xE9 el Secretario \u2014 hay un plazo legal",
      sources: [
        src("Request Public Records", "/i-want-to/get/request-public-records"),
        src("City Clerk \u2014 Public Records Request", "/departments/city-clerk/public-records-request")
      ]
    }),
    // ------------------------------------------------------------------ 21
    route({
      id: "power_outage",
      titleEn: "Power outage",
      titleEs: "Apag\xF3n / falta de electricidad",
      domain: "power",
      owner: "Southern California Edison",
      jurisdiction: "utility",
      noForm: false,
      methods: [
        web("https://www.comptoncity.org/i-want-to/report/outage-power", "City page for reporting a power outage"),
        phone(CITY_MAIN, "City of Compton main line", "needs_confirmation")
      ],
      triggersEn: [
        "the power has been out on our block since this morning",
        "half the street has no electricity",
        "our lights keep flickering and going out",
        "the power went out and it is not just my house",
        "how long is this outage going to last",
        "no power since the storm last night",
        "the whole block lost power at the same time",
        "my neighbors have lights and I do not",
        "power keeps cutting out every evening",
        "is there a planned outage on my street"
      ],
      triggersEs: [
        "no hay luz en nuestra cuadra desde la manana",
        "media calle no tiene electricidad",
        "las luces prenden y se apagan",
        "se fue la luz y no es solo mi casa",
        "cuanto va a durar este apagon",
        "no hay luz desde la tormenta de anoche",
        "toda la cuadra se quedo sin luz al mismo tiempo",
        "mis vecinos tienen luz y yo no",
        "la luz se corta cada tarde",
        "hay un corte programado en mi calle"
      ],
      evidenceEn: [
        "Your service address and the nearest cross streets",
        "When the power went out",
        "Whether neighbours are also out",
        "Whether anyone in the home depends on a medical device",
        "Your Edison account number if you have a bill nearby"
      ],
      evidenceEs: [
        "Su direcci\xF3n y las calles m\xE1s cercanas",
        "A qu\xE9 hora se fue la luz",
        "Si los vecinos tambi\xE9n est\xE1n sin luz",
        "Si alguien en el hogar depende de un aparato m\xE9dico",
        "Su n\xFAmero de cuenta de Edison si tiene un recibo a la mano"
      ],
      emergency: [
        "a downed or sparking line \u2014 stay away and call 9-1-1",
        "anyone on life-support equipment without power"
      ],
      confirmEn: "The outage ticket number and the estimated restoration time",
      confirmEs: "El n\xFAmero de reporte del apag\xF3n y la hora estimada de restablecimiento",
      checkpointEn: "Check at the restoration time you were given, then again 2 hours later",
      checkpointEs: "Verifique a la hora estimada que le dieron, y otra vez 2 horas despu\xE9s",
      sources: [src("Report Power Outage", "/i-want-to/report/outage-power"), SRC_REPORT_INDEX]
    }),
    // ------------------------------------------------------------------ 22
    route({
      id: "homeless_outreach",
      titleEn: "Homeless outreach and support",
      titleEs: "Ayuda para personas sin vivienda",
      domain: "human_services",
      owner: "City of Compton \u2014 Homeless Outreach",
      jurisdiction: "city",
      noForm: false,
      methods: [
        web("https://www.comptoncity.org/services/homeless-outreach", "Homeless outreach services"),
        phone(CITY_MAIN, "City of Compton main line \u2014 ask for homeless outreach")
      ],
      triggersEn: [
        "someone has been sleeping in the alley and I want them to get help",
        "there is an encampment near the park",
        "a person is living in a car on our street and needs services",
        "how do I get outreach to come help someone",
        "my cousin is about to lose their place, where do they go",
        "someone outside needs shelter tonight",
        "a person by the store looks like they need medical help",
        "who helps people living on the street here",
        "there is a tent on the sidewalk and I do not want anyone arrested",
        "I need shelter information for a family member"
      ],
      triggersEs: [
        "alguien esta durmiendo en el callejon y quiero que reciba ayuda",
        "hay un campamento cerca del parque",
        "una persona vive en un carro en nuestra calle y necesita servicios",
        "como pido que venga alguien a ayudar",
        "mi primo va a perder su casa, a donde va",
        "alguien afuera necesita refugio esta noche",
        "una persona junto a la tienda parece necesitar ayuda medica",
        "quien ayuda a la gente que vive en la calle aqui",
        "hay una casa de campana en la banqueta y no quiero que arresten a nadie",
        "necesito informacion de refugio para un familiar"
      ],
      evidenceEn: [
        "The location, described as a block or cross streets",
        "How many people appear to be there",
        "Whether anyone appears to need medical care",
        "Whether there are children or elders present",
        "The best time of day to find them there"
      ],
      evidenceEs: [
        "El lugar, descrito como cuadra o calles cercanas",
        "Cu\xE1ntas personas parece que hay",
        "Si alguien parece necesitar atenci\xF3n m\xE9dica",
        "Si hay menores o personas mayores",
        "La mejor hora del d\xEDa para encontrarlos ah\xED"
      ],
      extraProhibitedEn: [
        "Do not photograph people or their belongings",
        "Do not describe someone as dangerous, or report them to get them removed \u2014 this route is for connecting people to services"
      ],
      extraProhibitedEs: [
        "No fotograf\xEDe a las personas ni sus pertenencias",
        "No describa a alguien como peligroso ni reporte para que lo saquen \u2014 esta ruta es para conectar a la persona con servicios"
      ],
      emergency: ["a medical emergency, extreme heat or cold exposure, or anyone unresponsive \u2014 call 9-1-1"],
      confirmEn: "The name of the outreach team, a case or referral number, and when they expect to visit",
      confirmEs: "El nombre del equipo, un n\xFAmero de caso o referencia, y cu\xE1ndo esperan visitar",
      checkpointEn: "Check in 3 business days; outreach visits often take more than one attempt",
      checkpointEs: "Verifique en 3 d\xEDas h\xE1biles; a menudo se requiere m\xE1s de una visita",
      sources: [src("Homeless Outreach", "/services/homeless-outreach"), SRC_SERVICES]
    })
  ];

  // lib/serviceCatalog.ts
  var VERIFIED_ON2 = "2026-07-27";
  var MAINTAINER2 = "Civic Source Lead \u2014 COMPTON ONE catalog working group";
  var NEXT_REVIEW2 = "2026-08-26";
  var CITY_MAIN_LINE = "(310) 605-5500";
  var MUNI_UTILITIES_CUSTOMER_SERVICE = "(310) 605-5524";
  var PUBLIC_WORKS_LINE = "(310) 605-5691";
  var SRC_ILLEGAL_DUMPING = {
    label: "City of Compton \u2014 Report Illegal Dumping",
    url: "https://www.comptoncity.org/i-want-to/report/illegal-dumping",
    lastVerifiedAt: VERIFIED_ON2
  };
  var SRC_DIRECTORY2 = {
    label: "City of Compton \u2014 City Hall Directory",
    url: "https://www.comptoncity.org/our-city/contact-us/city-hall-directory",
    lastVerifiedAt: VERIFIED_ON2
  };
  var SRC_STREET_MAINT2 = {
    label: "City of Compton \u2014 Public Works Street Maintenance",
    url: "https://www.comptoncity.org/departments/public-works-street-maintenance",
    lastVerifiedAt: VERIFIED_ON2
  };
  var SRC_SL_COMPTON = {
    label: "City of Compton \u2014 Report Street Light Outage (Compton-owned)",
    url: "https://www.comptoncity.org/i-want-to/report/outage-street-light-compton",
    lastVerifiedAt: VERIFIED_ON2
  };
  var SRC_SL_SCE = {
    label: "City of Compton \u2014 Report Street Light Outage (SCE-owned)",
    url: "https://www.comptoncity.org/i-want-to/report/outage-street-light-sce",
    lastVerifiedAt: VERIFIED_ON2
  };
  var SRC_WASTE = {
    label: "City of Compton \u2014 Municipal Utilities, Waste Division",
    url: "https://www.comptoncity.org/departments/municipal-utilities/waste-division",
    lastVerifiedAt: VERIFIED_ON2
  };
  var SRC_TRASH_SCHEDULE = {
    label: "City of Compton \u2014 Trash Pickup Schedule",
    url: "https://www.comptoncity.org/services/trash-pickup-schedule",
    lastVerifiedAt: VERIFIED_ON2
  };
  var SRC_WATER = {
    label: "City of Compton \u2014 Municipal Utilities, Water Department",
    url: "https://www.comptoncity.org/departments/municipal-utilities/water-department",
    lastVerifiedAt: VERIFIED_ON2
  };
  var EMERGENCY_GUIDANCE = {
    en: {
      heading: "Stop \u2014 this may need emergency help",
      body: "If someone is in danger right now, call 9-1-1. COMPTON ONE is not an emergency service and does not contact responders for you.",
      sheriff: "Compton Sheriff's Station (non-emergency): (310) 605-6500",
      emergency: "Life-threatening emergencies: 9-1-1"
    },
    es: {
      heading: "Det\xE9ngase \u2014 esto puede requerir ayuda de emergencia",
      body: "Si alguien est\xE1 en peligro en este momento, llame al 9-1-1. COMPTON ONE no es un servicio de emergencia y no contacta a los servicios de respuesta por usted.",
      sheriff: "Estaci\xF3n del Sheriff de Compton (sin emergencia): (310) 605-6500",
      emergency: "Emergencias que amenazan la vida: 9-1-1"
    },
    source: SRC_DIRECTORY2
  };
  var CORE_CATALOG = {
    illegal_dumping: {
      serviceId: "illegal_dumping",
      title: { en: "Illegal dumping", es: "Descarga ilegal de basura" },
      category: "illegal_dumping",
      domain: "public_works",
      responsibleEntity: "City of Compton \u2014 Clean Compton Initiative",
      noDedicatedCityForm: false,
      jurisdiction: "city",
      intakeMethods: [
        {
          type: "web",
          label: {
            en: "Official illegal dumping report form",
            es: "Formulario oficial para reportar descarga ilegal"
          },
          destination: "https://www.comptoncity.org/i-want-to/report/illegal-dumping",
          reaches: "City of Compton \u2014 Clean Compton Initiative",
          verificationState: "officially_verified",
          lastVerifiedAt: VERIFIED_ON2
        },
        {
          type: "phone",
          label: { en: "Public Works line", es: "L\xEDnea de Obras P\xFAblicas" },
          destination: PUBLIC_WORKS_LINE,
          reaches: "City of Compton \u2014 Public Works",
          appliesWhen: {
            en: "Use if the online form is unavailable. This number is listed under Public Works in the city directory but is not published as a resident reporting line.",
            es: "\xDAselo si el formulario en l\xEDnea no est\xE1 disponible. Este n\xFAmero aparece bajo Obras P\xFAblicas en el directorio de la ciudad, pero no se publica como l\xEDnea de reportes para residentes."
          },
          verificationState: "needs_confirmation",
          lastVerifiedAt: VERIFIED_ON2
        }
      ],
      triggerExamples: {
        en: [
          "someone dumped a couch in the alley",
          "there is a mattress on the sidewalk",
          "people keep leaving trash behind my building",
          "pile of construction debris on the corner",
          "old tires dumped near the lot",
          "furniture left on the curb for weeks",
          "bags of garbage thrown in the alley",
          "someone dumped a broken tv",
          "illegal dumping on my street",
          "appliances abandoned on the street"
        ],
        es: [
          "alguien tir\xF3 un sof\xE1 en el callej\xF3n",
          "hay un colch\xF3n en la banqueta",
          "siguen dejando basura detr\xE1s de mi edificio",
          "mont\xF3n de escombros de construcci\xF3n en la esquina",
          "llantas viejas tiradas cerca del lote",
          "muebles abandonados en la banqueta",
          "bolsas de basura tiradas en el callej\xF3n",
          "tiraron un televisor roto",
          "descarga ilegal en mi calle",
          "electrodom\xE9sticos abandonados en la calle"
        ]
      },
      evidenceRequirements: {
        en: [
          "Photo taken from a safe distance, from the sidewalk or your property",
          "Nearest cross streets or block number",
          "Date you first saw it",
          "What the items are (furniture, tires, construction debris, bags)",
          "Whether it is blocking a sidewalk, driveway, or road"
        ],
        es: [
          "Foto tomada desde una distancia segura, desde la banqueta o su propiedad",
          "Calles cruzadas m\xE1s cercanas o n\xFAmero de cuadra",
          "Fecha en que lo vio por primera vez",
          "Qu\xE9 son los art\xEDculos (muebles, llantas, escombros, bolsas)",
          "Si est\xE1 bloqueando una banqueta, entrada o calle"
        ]
      },
      prohibitedData: {
        en: [
          "Do not photograph faces or license plates",
          "Do not name or accuse a specific person",
          "Do not enter private property to get a photo",
          "Do not touch or open the dumped material"
        ],
        es: [
          "No fotograf\xEDe rostros ni placas de veh\xEDculos",
          "No nombre ni acuse a una persona espec\xEDfica",
          "No entre a propiedad privada para tomar una foto",
          "No toque ni abra el material tirado"
        ]
      },
      emergencyExclusions: [
        "chemical drums or unlabeled liquid containers",
        "medical or biohazard waste, needles, syringes",
        "material actively on fire or smoking",
        "suspected asbestos or friable insulation"
      ],
      expectedConfirmation: {
        en: "The confirmation email the form sends you, or the date and name from your call",
        es: "El correo de confirmaci\xF3n que env\xEDa el formulario, o la fecha y el nombre de su llamada"
      },
      followUpPolicy: {
        residentCheckpoint: {
          en: "Check back in 5 business days. The city has not published a response time for this service.",
          es: "Verifique en 5 d\xEDas h\xE1biles. La ciudad no ha publicado un tiempo de respuesta para este servicio."
        },
        officialSlaConfirmed: false
      },
      sourceReferences: [SRC_ILLEGAL_DUMPING, SRC_DIRECTORY2],
      maintainer: MAINTAINER2,
      nextReviewAt: NEXT_REVIEW2
    },
    pothole: {
      serviceId: "pothole",
      title: { en: "Pothole or roadway damage", es: "Bache o da\xF1o en la calzada" },
      category: "pothole",
      domain: "public_works",
      responsibleEntity: "City of Compton \u2014 Public Works, Street Maintenance Division",
      noDedicatedCityForm: true,
      jurisdiction: "city",
      intakeMethods: [
        {
          type: "phone",
          label: { en: "City main line", es: "L\xEDnea principal de la ciudad" },
          destination: CITY_MAIN_LINE,
          reaches: "City of Compton switchboard \u2014 ask for Public Works, Street Maintenance",
          appliesWhen: {
            en: "The city does not publish an online pothole form. Calling is the documented path.",
            es: "La ciudad no publica un formulario en l\xEDnea para baches. Llamar es la v\xEDa documentada."
          },
          verificationState: "officially_verified",
          lastVerifiedAt: VERIFIED_ON2
        },
        {
          type: "phone",
          label: { en: "Public Works line", es: "L\xEDnea de Obras P\xFAblicas" },
          destination: PUBLIC_WORKS_LINE,
          reaches: "City of Compton \u2014 Public Works",
          appliesWhen: {
            en: "Listed under Public Works in the city directory, but not published as a resident reporting line.",
            es: "Aparece bajo Obras P\xFAblicas en el directorio, pero no se publica como l\xEDnea de reportes."
          },
          verificationState: "needs_confirmation",
          lastVerifiedAt: VERIFIED_ON2
        }
      ],
      triggerExamples: {
        en: [
          "there is a hole in the street near my house",
          "big pothole on my block",
          "the road is broken and cars keep hitting it",
          "pothole damaged my tire",
          "the pavement is cracked and sinking",
          "huge dip in the road",
          "crater in the street",
          "the asphalt is coming apart",
          "street needs repaving",
          "hole in the road keeps getting bigger"
        ],
        es: [
          "hay un hoyo en la calle cerca de mi casa",
          "un bache grande en mi cuadra",
          "la calle est\xE1 rota y los carros le pegan",
          "un bache da\xF1\xF3 mi llanta",
          "el pavimento est\xE1 agrietado y hundido",
          "un hundimiento grande en la calle",
          "un cr\xE1ter en la calle",
          "el asfalto se est\xE1 deshaciendo",
          "la calle necesita repavimentaci\xF3n",
          "el hoyo en la calle se hace m\xE1s grande"
        ]
      },
      evidenceRequirements: {
        en: [
          "Photo taken from the sidewalk, never from the roadway",
          "Nearest address or cross streets",
          "Which lane or side of the street",
          "Rough size and depth",
          "Whether it has already damaged a vehicle"
        ],
        es: [
          "Foto tomada desde la banqueta, nunca desde la calzada",
          "Direcci\xF3n m\xE1s cercana o calles cruzadas",
          "Qu\xE9 carril o lado de la calle",
          "Tama\xF1o y profundidad aproximados",
          "Si ya ha da\xF1ado un veh\xEDculo"
        ]
      },
      prohibitedData: {
        en: [
          "Do not take photos while driving",
          "Do not stand in the roadway",
          "Do not include faces or license plates"
        ],
        es: [
          "No tome fotos mientras conduce",
          "No se pare en la calzada",
          "No incluya rostros ni placas de veh\xEDculos"
        ]
      },
      emergencyExclusions: [
        "sinkhole or collapsing pavement",
        "exposed live wiring in the roadway",
        "active water main break under the street"
      ],
      expectedConfirmation: {
        en: "The date you called, who you spoke with, and any request or reference number they give you",
        es: "La fecha en que llam\xF3, con qui\xE9n habl\xF3, y cualquier n\xFAmero de solicitud o referencia"
      },
      followUpPolicy: {
        residentCheckpoint: {
          en: "Check back in 5 business days. The city has not published a response time for this service.",
          es: "Verifique en 5 d\xEDas h\xE1biles. La ciudad no ha publicado un tiempo de respuesta para este servicio."
        },
        officialSlaConfirmed: false
      },
      sourceReferences: [SRC_STREET_MAINT2, SRC_DIRECTORY2],
      maintainer: MAINTAINER2,
      nextReviewAt: NEXT_REVIEW2
    },
    streetlight: {
      serviceId: "streetlight",
      title: { en: "Streetlight outage", es: "Luminaria p\xFAblica apagada" },
      category: "streetlight",
      domain: "public_works",
      /**
       * Real jurisdictional split: the city publishes TWO separate report forms
       * because some poles are city-owned and some belong to Southern California
       * Edison. The resident cannot be expected to know which. The clarifying
       * question exists for exactly this case.
       */
      responsibleEntity: "City of Compton \u2014 Public Works, or Southern California Edison, depending on pole ownership",
      noDedicatedCityForm: false,
      jurisdiction: "city",
      intakeMethods: [
        {
          type: "web",
          label: {
            en: "Report a Compton-owned streetlight",
            es: "Reportar una luminaria de la Ciudad de Compton"
          },
          destination: "https://www.comptoncity.org/i-want-to/report/outage-street-light-compton",
          reaches: "City of Compton \u2014 Public Works",
          appliesWhen: {
            en: "Use when the pole carries a City of Compton marking, or when you are not sure and want to start with the city.",
            es: "\xDAselo cuando el poste tenga una marca de la Ciudad de Compton, o si no est\xE1 seguro y quiere empezar con la ciudad."
          },
          verificationState: "officially_verified",
          lastVerifiedAt: VERIFIED_ON2
        },
        {
          type: "web",
          label: {
            en: "Report an SCE-owned streetlight",
            es: "Reportar una luminaria de SCE"
          },
          destination: "https://www.comptoncity.org/i-want-to/report/outage-street-light-sce",
          reaches: "Southern California Edison",
          appliesWhen: {
            en: "Use when the pole carries a Southern California Edison tag or number.",
            es: "\xDAselo cuando el poste tenga una etiqueta o n\xFAmero de Southern California Edison."
          },
          verificationState: "officially_verified",
          lastVerifiedAt: VERIFIED_ON2
        }
      ],
      triggerExamples: {
        en: [
          "the streetlight has been out for two weeks",
          "street light is out on my corner",
          "the whole block is dark at night",
          "lamp post is not working",
          "street lamp flickers all night",
          "no light on the street outside my house",
          "the light on the pole burned out",
          "it is pitch black on our street",
          "streetlight stays on during the day",
          "broken street light near the park"
        ],
        es: [
          "la luminaria lleva dos semanas apagada",
          "la luz de la calle est\xE1 apagada en mi esquina",
          "toda la cuadra est\xE1 oscura de noche",
          "el poste de luz no funciona",
          "la l\xE1mpara de la calle parpadea toda la noche",
          "no hay luz en la calle frente a mi casa",
          "se quem\xF3 la luz del poste",
          "est\xE1 muy oscuro en nuestra calle",
          "la luminaria se queda encendida de d\xEDa",
          "luz de la calle rota cerca del parque"
        ]
      },
      evidenceRequirements: {
        en: [
          "Pole number or tag if you can read it safely from the sidewalk",
          "Whether the pole is marked City of Compton or Southern California Edison",
          "Nearest cross streets",
          "Date you first noticed it",
          "Night photo only if you can take it safely",
          "Whether the outage affects one light or the whole block"
        ],
        es: [
          "N\xFAmero o etiqueta del poste si puede leerlo con seguridad desde la banqueta",
          "Si el poste est\xE1 marcado Ciudad de Compton o Southern California Edison",
          "Calles cruzadas m\xE1s cercanas",
          "Fecha en que lo not\xF3 por primera vez",
          "Foto nocturna solo si puede tomarla con seguridad",
          "Si afecta una luz o toda la cuadra"
        ]
      },
      prohibitedData: {
        en: [
          "Do not touch the pole, wiring, or any open panel",
          "Do not photograph faces or license plates",
          "Do not go out alone at night to get a photo if you do not feel safe"
        ],
        es: [
          "No toque el poste, el cableado ni ning\xFAn panel abierto",
          "No fotograf\xEDe rostros ni placas de veh\xEDculos",
          "No salga solo de noche a tomar una foto si no se siente seguro"
        ]
      },
      emergencyExclusions: [
        "downed power line or wire on the ground",
        "sparking, arcing, or smoking pole",
        "pole leaning, cracked, or struck by a vehicle",
        "exposed wiring within reach"
      ],
      expectedConfirmation: {
        en: "The confirmation the form sends you, plus the pole number you reported",
        es: "La confirmaci\xF3n que env\xEDa el formulario, m\xE1s el n\xFAmero de poste que report\xF3"
      },
      followUpPolicy: {
        residentCheckpoint: {
          en: "Check back in 5 business days. The city has not published a response time for this service.",
          es: "Verifique en 5 d\xEDas h\xE1biles. La ciudad no ha publicado un tiempo de respuesta para este servicio."
        },
        officialSlaConfirmed: false
      },
      sourceReferences: [SRC_SL_COMPTON, SRC_SL_SCE],
      maintainer: MAINTAINER2,
      nextReviewAt: NEXT_REVIEW2
    },
    missed_trash: {
      serviceId: "missed_trash",
      title: { en: "Missed trash pickup", es: "Recolecci\xF3n de basura omitida" },
      category: "missed_trash",
      domain: "waste",
      responsibleEntity: "City of Compton \u2014 Municipal Utilities, Waste Division",
      noDedicatedCityForm: true,
      jurisdiction: "city",
      intakeMethods: [
        {
          type: "phone",
          label: {
            en: "Municipal Utilities customer service",
            es: "Servicio al cliente de Servicios Municipales"
          },
          destination: MUNI_UTILITIES_CUSTOMER_SERVICE,
          reaches: "City of Compton \u2014 Municipal Utilities customer service",
          appliesWhen: {
            en: "The city does not publish an online missed-pickup form. Calling customer service is the documented path.",
            es: "La ciudad no publica un formulario en l\xEDnea para recolecci\xF3n omitida. Llamar a servicio al cliente es la v\xEDa documentada."
          },
          verificationState: "officially_verified",
          lastVerifiedAt: VERIFIED_ON2
        },
        {
          type: "phone",
          label: { en: "City main line", es: "L\xEDnea principal de la ciudad" },
          destination: CITY_MAIN_LINE,
          reaches: "City of Compton switchboard \u2014 ask for the Waste Division",
          verificationState: "officially_verified",
          lastVerifiedAt: VERIFIED_ON2
        }
      ],
      triggerExamples: {
        en: [
          "our trash was skipped",
          "the garbage truck did not come",
          "they missed our bins this week",
          "trash has not been collected on my street",
          "the carts are still full after pickup day",
          "recycling was not picked up",
          "garbage service skipped our block",
          "green waste bin was not emptied",
          "they only took one of our carts",
          "no trash pickup for two weeks"
        ],
        es: [
          "no recogieron nuestra basura",
          "el cami\xF3n de basura no vino",
          "omitieron nuestros botes esta semana",
          "no han recogido la basura en mi calle",
          "los botes siguen llenos despu\xE9s del d\xEDa de recolecci\xF3n",
          "no recogieron el reciclaje",
          "el servicio de basura omiti\xF3 nuestra cuadra",
          "no vaciaron el bote de jard\xEDn",
          "solo se llevaron uno de nuestros botes",
          "no hay recolecci\xF3n de basura desde hace dos semanas"
        ]
      },
      evidenceRequirements: {
        en: [
          "Your scheduled pickup day",
          "Photo of the carts still full, taken after the pickup window",
          "Service address or approximate block",
          "Which carts were missed (trash, recycling, green waste)",
          "Whether the carts were out before the required time",
          "Whether anyone in the household needs help moving carts"
        ],
        es: [
          "Su d\xEDa programado de recolecci\xF3n",
          "Foto de los botes a\xFAn llenos, tomada despu\xE9s del horario de recolecci\xF3n",
          "Direcci\xF3n de servicio o cuadra aproximada",
          "Qu\xE9 botes fueron omitidos (basura, reciclaje, jard\xEDn)",
          "Si los botes estaban afuera antes de la hora requerida",
          "Si alguien en el hogar necesita ayuda para mover los botes"
        ]
      },
      prohibitedData: {
        en: [
          "Do not include your account number in a photo",
          "Do not photograph neighbors or their property",
          "Do not include faces or license plates"
        ],
        es: [
          "No incluya su n\xFAmero de cuenta en una foto",
          "No fotograf\xEDe a vecinos ni su propiedad",
          "No incluya rostros ni placas de veh\xEDculos"
        ]
      },
      emergencyExclusions: [
        "sharps, needles, or medical waste left in or beside the cart",
        "chemical or unlabeled liquid containers in the cart",
        "cart fire or smoldering contents"
      ],
      expectedConfirmation: {
        en: "The date you called, who you spoke with, and any service request number",
        es: "La fecha en que llam\xF3, con qui\xE9n habl\xF3, y cualquier n\xFAmero de solicitud de servicio"
      },
      followUpPolicy: {
        residentCheckpoint: {
          en: "Check back in 2 business days. The city has not published a recovery time for missed pickups.",
          es: "Verifique en 2 d\xEDas h\xE1biles. La ciudad no ha publicado un tiempo de recuperaci\xF3n para recolecciones omitidas."
        },
        officialSlaConfirmed: false
      },
      sourceReferences: [SRC_WASTE, SRC_TRASH_SCHEDULE, SRC_DIRECTORY2],
      maintainer: MAINTAINER2,
      nextReviewAt: NEXT_REVIEW2
    },
    water_or_sewer: {
      serviceId: "water_or_sewer",
      title: { en: "Water or sewer concern", es: "Problema de agua o alcantarillado" },
      category: "water_or_sewer",
      domain: "water",
      responsibleEntity: "City of Compton \u2014 Municipal Utilities, Water Department",
      noDedicatedCityForm: true,
      jurisdiction: "city",
      intakeMethods: [
        {
          type: "phone",
          label: {
            en: "Municipal Utilities customer service",
            es: "Servicio al cliente de Servicios Municipales"
          },
          destination: MUNI_UTILITIES_CUSTOMER_SERVICE,
          reaches: "City of Compton \u2014 Municipal Utilities customer service",
          appliesWhen: {
            en: "The city does not publish an online water or sewer report form. Calling is the documented path.",
            es: "La ciudad no publica un formulario en l\xEDnea para agua o alcantarillado. Llamar es la v\xEDa documentada."
          },
          verificationState: "officially_verified",
          lastVerifiedAt: VERIFIED_ON2
        },
        {
          type: "phone",
          label: { en: "City main line", es: "L\xEDnea principal de la ciudad" },
          destination: CITY_MAIN_LINE,
          reaches: "City of Compton switchboard \u2014 ask for the Water Department",
          verificationState: "officially_verified",
          lastVerifiedAt: VERIFIED_ON2
        }
      ],
      triggerExamples: {
        en: [
          "there is sewage smell behind the house",
          "water is leaking from the street",
          "my water pressure dropped",
          "the water looks brown",
          "there is a puddle that never dries by the curb",
          "sewer is backing up",
          "manhole is overflowing",
          "water main looks like it is leaking",
          "the drain outside smells bad",
          "water has a strange taste"
        ],
        es: [
          "hay olor a aguas negras detr\xE1s de la casa",
          "hay una fuga de agua en la calle",
          "baj\xF3 la presi\xF3n del agua",
          "el agua se ve caf\xE9",
          "hay un charco que nunca se seca junto a la banqueta",
          "el drenaje se est\xE1 regresando",
          "la alcantarilla se est\xE1 desbordando",
          "parece que hay una fuga en la tuber\xEDa principal",
          "el drenaje de afuera huele mal",
          "el agua tiene un sabor extra\xF1o"
        ]
      },
      evidenceRequirements: {
        en: [
          "What you observed: smell, leak, discoloration, pressure, or backup",
          "When it started",
          "Location, described from a safe distance",
          "Whether it is inside your property or in the street",
          "Photo only if you can take it without contacting the water"
        ],
        es: [
          "Qu\xE9 observ\xF3: olor, fuga, decoloraci\xF3n, presi\xF3n o retorno",
          "Cu\xE1ndo comenz\xF3",
          "Ubicaci\xF3n, descrita desde una distancia segura",
          "Si est\xE1 dentro de su propiedad o en la calle",
          "Foto solo si puede tomarla sin tocar el agua"
        ]
      },
      prohibitedData: {
        en: [
          "Do not describe health symptoms as caused by the water \u2014 report what you observed",
          "Do not enter standing water or a flooded area",
          "Do not open a manhole or drain cover",
          "Do not include faces or license plates"
        ],
        es: [
          "No describa s\xEDntomas de salud como causados por el agua \u2014 reporte lo que observ\xF3",
          "No entre en agua estancada ni en un \xE1rea inundada",
          "No abra una alcantarilla ni una tapa de drenaje",
          "No incluya rostros ni placas de veh\xEDculos"
        ]
      },
      emergencyExclusions: [
        "sewage entering a home or living space",
        "active flooding of a street or property",
        "water main break with rapid flow",
        "suspected gas odor alongside the water issue",
        "anyone reporting illness they believe is from the water"
      ],
      expectedConfirmation: {
        en: "The date you called, who you spoke with, and any service request number",
        es: "La fecha en que llam\xF3, con qui\xE9n habl\xF3, y cualquier n\xFAmero de solicitud de servicio"
      },
      followUpPolicy: {
        residentCheckpoint: {
          en: "Check back in 2 business days. If conditions worsen, call again immediately rather than waiting.",
          es: "Verifique en 2 d\xEDas h\xE1biles. Si las condiciones empeoran, vuelva a llamar de inmediato en lugar de esperar."
        },
        officialSlaConfirmed: false
      },
      sourceReferences: [SRC_WATER, SRC_DIRECTORY2],
      maintainer: MAINTAINER2,
      nextReviewAt: NEXT_REVIEW2
    }
  };
  var serviceCatalog = (() => {
    const merged = { ...CORE_CATALOG };
    for (const r of EXTENDED_ROUTES) {
      if (merged[r.serviceId]) {
        throw new Error(`Duplicate serviceId in catalog: ${r.serviceId}`);
      }
      merged[r.serviceId] = r;
    }
    return merged;
  })();
  var SERVICE_IDS = Object.keys(serviceCatalog);
  function isSupportedServiceId(value) {
    return typeof value === "string" && Object.prototype.hasOwnProperty.call(serviceCatalog, value);
  }

  // lib/rulesExtended.ts
  var EXTENDED_RULES = [
    {
      id: "graffiti",
      strong: ["graffiti", "grafiti", "tagged", "tagging", "spray painted", "spray paint", "rayaron", "pintaron la pared", "grafiti en el poste", "markings keep coming back", "pintaron otra vez", "pinto mi porton", "vuelven a rayar", "painted over it and they"],
      medium: [
        "painted over it",
        "markings on the wall",
        "wrote on my garage",
        "covered in paint",
        "rayones",
        "pinta en la pared",
        "volvieron a rayar",
        "pintarrajeado"
      ],
      weak: ["tag", "mural", "pared", "wall"]
    },
    {
      id: "abandoned_vehicle",
      strong: [
        "abandoned car",
        "abandoned vehicle",
        "abandoned truck",
        "junk car",
        "inoperable vehicle",
        "carro abandonado",
        "vehiculo abandonado",
        "troca abandonada",
        "carro inservible",
        "car with no plates",
        "carro sin placas",
        "dumped a car",
        "dejaron un carro"
      ],
      medium: [
        "has not moved",
        "has not been moved",
        "parked for months",
        "parked for weeks",
        "flat tires for",
        "no plates",
        "expired tags",
        "wrecked car",
        "camper has been parked",
        "no se ha movido",
        "lleva meses estacionado",
        "lleva semanas estacionado",
        "llantas ponchadas",
        "sin placas",
        "placas vencidas",
        "carro chocado",
        "casa rodante",
        "same car has been there",
        "broken windows",
        "mismo carro sigue",
        "vidrios rotos"
      ],
      weak: ["vehicle", "van", "camper", "camioneta"]
    },
    {
      id: "sidewalk",
      strong: ["sidewalk", "side walk", "curb ramp", "rampa de la esquina", "banqueta rota", "banqueta levantada", "banqueta esta", "wheelchair cannot", "stroller tips", "broken pavement on the sidewalk"],
      medium: [
        "lifted and my",
        "concrete is cracked",
        "uneven concrete",
        "trip on it",
        "tripping hazard",
        "wheelchair cannot",
        "walker cannot",
        "stroller tips",
        "walkway is broken",
        "esta levantada",
        "cemento agrietado",
        "se tropieza",
        "silla de ruedas no pasa",
        "la carriola se voltea",
        "esta desmoronando",
        "banqueta",
        "acera"
      ],
      weak: ["concrete", "walkway", "cemento", "tropezar"]
    },
    {
      id: "street_tree",
      strong: [
        "street tree",
        "tree branch",
        "tree limb",
        "branch is hanging",
        "dead tree",
        "tree trimming",
        "arbol de la calle",
        "rama grande",
        "rama colgando",
        "arbol seco",
        "podar el arbol",
        "arbol",
        "tree is blocking",
        "arbol tapa",
        "arbol de la banqueta",
        "ramas tapan",
        "branches are blocking",
        "tree in the parkway"
      ],
      medium: [
        "branches are blocking",
        "roots from the tree",
        "tree roots",
        "limb came down",
        "tree is leaning",
        "low branches",
        "needs trimming",
        "tree drops branches",
        "ramas tapan",
        "raices del arbol",
        "se cayo una rama",
        "arbol inclinado",
        "ramas bajas",
        "hay que podar",
        "arbol tira ramas"
      ],
      weak: ["tree", "branch", "limb", "arbol", "rama", "raices"]
    },
    {
      id: "traffic_sign_signal",
      strong: [
        "stop sign",
        "traffic light",
        "traffic signal",
        "crosswalk",
        "street name sign",
        "speed limit sign",
        "senal de alto",
        "letrero de alto",
        "semaforo",
        "cruce peatonal",
        "letrero de la calle",
        "lineas de los carriles",
        "lane lines"
      ],
      medium: [
        "flashing red",
        "signal never changes",
        "arrow light",
        "crossing signal button",
        "lane lines",
        "paint is worn off",
        "school zone sign",
        "sign got knocked down",
        "rojo intermitente",
        "nunca cambia",
        "flecha del semaforo",
        "boton para cruzar",
        "lineas de los carriles",
        "zona escolar",
        "tumbaron el letrero"
      ],
      weak: ["sign", "signal", "intersection", "letrero", "senal", "crucero"]
    },
    {
      id: "storm_drain",
      strong: [
        "storm drain",
        "catch basin",
        "drain grate",
        "street floods",
        "flooding when it rains",
        "alcantarilla pluvial",
        "coladera pluvial",
        "rejilla del drenaje",
        "la calle se inunda",
        "alcantarilla llena",
        "coladera tapada",
        "rejilla del drenaje rota",
        "agua de lluvia",
        "rain water",
        "storm drain smells",
        "alcantarilla huele",
        "drenaje pluvial",
        "hojas y basura",
        "coladera pluvial",
        "llena de basura",
        "alcantarilla esta llena"
      ],
      medium: [
        "floods every time it rains",
        "water pools at the corner",
        "never drains",
        "gutter is full",
        "water backs up when it rains",
        "turns into a lake",
        "water sits in the street",
        "se inunda cuando llueve",
        "el agua se junta",
        "no baja el agua",
        "cuneta llena",
        "se hace laguna",
        "agua se queda en la calle",
        "comes up over the curb",
        "se pasa al patio",
        "le faltan barras",
        "llena de hojas"
      ],
      weak: ["rain", "rains", "gutter", "lluvia", "cuneta", "inundacion"]
    },
    {
      id: "bulky_item",
      strong: [
        "bulky item",
        "bulky pickup",
        "bulk pickup",
        "haul away",
        "get rid of an old",
        "dispose of",
        "articulos voluminosos",
        "recoleccion de articulos grandes",
        "me deshago de",
        "desechar",
        "big item picked up",
        "articulo grande",
        "recojan un",
        "llevarse mi",
        "mesa vieja",
        "sillon viejo",
        "put out a mattress",
        "muebles que el camion",
        "camion no se lleva",
        "cuanto cuesta que recojan",
        "haul away my old",
        "pick up a broken refrigerator",
        "refrigerador descompuesto"
      ],
      medium: [
        "pick up a broken refrigerator",
        "old mattress the right way",
        "appointment for a bulky",
        "furniture the truck will not take",
        "will not take my old",
        "to get rid of",
        "cita para recoleccion",
        "colchon de forma legal",
        "el camion no se lleva",
        "quiero desechar"
      ],
      weak: ["haul"]
    },
    {
      id: "recycling_ewaste",
      strong: [
        "e waste",
        "ewaste",
        "electronic waste",
        "recycle",
        "recycling",
        "hazardous waste",
        "reciclaje",
        "reciclar",
        "residuos peligrosos",
        "desechos electronicos",
        "motor oil",
        "aceite de motor",
        "where can i take",
        "donde puedo llevar",
        "deshago de pintura",
        "get rid of paint",
        "old batteries",
        "pilas viejas"
      ],
      medium: [
        "where do i take an old computer",
        "get rid of paint",
        "old batteries",
        "motor oil",
        "blue bin",
        "recycling cart",
        "old tires",
        "recycle cardboard",
        "donde llevo una computadora",
        "deshago de pintura",
        "pilas viejas",
        "aceite de motor",
        "bote azul",
        "bote de reciclaje",
        "llantas viejas",
        "reciclo carton"
      ],
      weak: ["batteries", "computer", "electronics", "paint", "pilas", "computadora", "pintura"]
    },
    {
      id: "animal_control",
      strong: [
        "stray dog",
        "loose dogs",
        "animal control",
        "dead animal",
        "dog bit",
        "coyote",
        "perro callejero",
        "perros sueltos",
        "control de animales",
        "animal muerto",
        "perro mordio",
        "gato herido",
        "injured cat",
        "animal herido",
        "injured animal",
        "dead animal in the street"
      ],
      medium: [
        "dog keeps getting out",
        "litter of kittens",
        "too many animals",
        "injured cat",
        "tied up with no water",
        "chasing kids",
        "animal is hurt",
        "perro se sale",
        "gatitos en el callejon",
        "demasiados animales",
        "gato herido",
        "amarrado sin agua",
        "persigue a los ninos",
        "animal herido"
      ],
      weak: ["dog", "cat", "animal", "kittens", "perro", "gato", "gatitos"]
    },
    {
      id: "code_violation",
      strong: [
        "code violation",
        "code enforcement",
        "no permit",
        "without a permit",
        "unpermitted",
        "violacion de codigo",
        "sin permiso",
        "codigo de la ciudad",
        "overgrown",
        "maleza",
        "running a business out of a house",
        "negocio en una casa",
        "barda caida",
        "casa vacia",
        "entrando y saliendo",
        "atrayendo ratas",
        "vacant house",
        "vacant and open",
        "lote baldio",
        "full of junk"
      ],
      medium: [
        "empty lot is overgrown",
        "overgrown and full of junk",
        "living in a shed",
        "vacant and open",
        "trash piled up in the yard",
        "built an addition",
        "attracting rats",
        "unit in the garage",
        "fence has been down",
        "vacant house has people",
        "lote lleno de maleza",
        "viviendo en un cuartito",
        "lleva meses vacio",
        "basura amontonada en el patio",
        "construyeron un cuarto",
        "atrayendo ratas",
        "departamento en la cochera",
        "barda caida",
        "casa vacia con gente",
        "barda",
        "perros se salen",
        "lleva un ano caida"
      ],
      weak: ["overgrown", "vacant", "yard", "maleza", "patio", "baldio"]
    },
    {
      id: "housing_help",
      strong: [
        "section 8",
        "housing voucher",
        "rent assistance",
        "housing authority",
        "eviction",
        "evicted",
        "seccion 8",
        "vale de vivienda",
        "ayuda de renta",
        "autoridad de vivienda",
        "desalojo",
        "desalojar",
        "quedarme en mi casa",
        "staying in my home"
      ],
      medium: [
        "landlord will not fix",
        "landlord raised the rent",
        "behind on rent",
        "apartment has mold",
        "no hot water for weeks",
        "help paying for a new roof",
        "help staying in my home",
        "the manager ignores me",
        "casero no arregla",
        "casero subio la renta",
        "atrasado con la renta",
        "departamento tiene moho",
        "sin agua caliente",
        "ayuda para pagar un techo",
        "ayudarme a quedarme en mi casa",
        "el manager no hace nada"
      ],
      weak: ["landlord", "tenant", "casero", "inquilino", "vivienda"]
    },
    {
      id: "parking_citation",
      strong: [
        "parking ticket",
        "parking citation",
        "parking fine",
        "appeal a ticket",
        "contest a ticket",
        "multa de estacionamiento",
        "apelar la multa",
        "boleta de estacionamiento"
      ],
      medium: [
        "got a ticket",
        "fight a parking",
        "where do i pay a parking",
        "citation number",
        "street sweeping day but the signs",
        "fine doubled",
        "wrong plate on it",
        "ticketed in front of my own house",
        "me multaron",
        "peleo una multa",
        "donde pago una multa",
        "numero de multa",
        "dia de barrido",
        "multa se duplico",
        "placa equivocada"
      ],
      weak: ["ticket", "citation", "fine", "multa", "boleta"]
    },
    {
      id: "utility_billing",
      strong: [
        "water bill",
        "utility bill",
        "shut off my water",
        "shutoff notice",
        "payment plan",
        "recibo del agua",
        "recibo de servicios",
        "cortarme el agua",
        "aviso de corte",
        "plan de pagos",
        "recibo de agua",
        "water bill",
        "dar de alta el servicio",
        "set up water service",
        "transfer service",
        "transfiero el servicio",
        "doy de alta",
        "alta el servicio",
        "recibo muestra",
        "consumo de cuando"
      ],
      medium: [
        "bill tripled",
        "set up water service",
        "transfer service when i move",
        "never got my bill",
        "still shows a balance",
        "dispute a charge",
        "discount for seniors",
        "usage from when the house was empty",
        "recibo se triplico",
        "dar de alta el servicio",
        "transfiero el servicio",
        "no me llego el recibo",
        "sigue con saldo",
        "disputo un cargo",
        "descuento para personas mayores"
      ],
      weak: ["bill", "account", "balance", "recibo", "cuenta", "saldo"]
    },
    {
      id: "business_permit",
      strong: [
        "business license",
        "business licence",
        "building permit",
        "film permit",
        "adu",
        "licencia de negocio",
        "permiso de construccion",
        "permiso de filmacion"
      ],
      medium: [
        "permit to put a taco stand",
        "permit to add a room",
        "renew my business",
        "open a small shop",
        "permit for a food truck",
        "contractor says i need",
        "permits do i need for a home business",
        "build an adu",
        "permiso para poner un puesto",
        "permiso para agregar un cuarto",
        "renovar mi licencia",
        "abrir un negocio",
        "permiso para un food truck",
        "contratista dice que necesito",
        "permisos necesito para un negocio en casa",
        "construir un cuarto adicional"
      ],
      weak: ["permit", "license", "licence", "contractor", "permiso", "licencia", "contratista"]
    },
    {
      id: "public_records",
      strong: [
        "public record",
        "public records",
        "records request",
        "city council meeting",
        "council agenda",
        "municipal code",
        "registros publicos",
        "solicitud de registros",
        "junta del consejo",
        "codigo municipal"
      ],
      medium: [
        "copy of a report",
        "copy of a city document",
        "minutes from a council",
        "see the city budget",
        "copy of a permit that was issued",
        "documentation about a property from the city",
        "copia de un reporte",
        "copia de un documento de la ciudad",
        "minutas de una junta",
        "presupuesto de la ciudad",
        "copia de un permiso",
        "documentacion de la ciudad"
      ],
      weak: ["records", "document", "minutes", "agenda", "registros", "documento", "minutas"]
    },
    {
      id: "power_outage",
      strong: [
        "power outage",
        "power is out",
        "no electricity",
        "lost power",
        "blackout",
        "apagon",
        "sin electricidad",
        "se fue la luz",
        "lights keep flickering and going out",
        "las luces prenden y se apagan",
        "prenden y se apagan",
        "no electricity",
        "sin electricidad",
        "no hay luz en mi casa",
        "no hay luz en la cuadra",
        "se quedo sin luz"
      ],
      medium: [
        "power has been out",
        "half the street has no",
        "lights keep flickering and going out",
        "how long is this outage",
        "no power since",
        "whole block lost power",
        "neighbors have lights and i do not",
        "power keeps cutting out",
        "planned outage",
        "no hay luz en nuestra cuadra",
        "media calle no tiene electricidad",
        "cuanto va a durar este apagon",
        "toda la cuadra se quedo sin luz",
        "mis vecinos tienen luz",
        "la luz se corta",
        "corte programado",
        "no hay luz desde",
        "luz desde la tormenta",
        "since the storm"
      ],
      weak: ["power", "electricity", "outage", "electricidad", "corte"]
    },
    {
      id: "homeless_outreach",
      strong: [
        "homeless",
        "encampment",
        "outreach team",
        "shelter tonight",
        "unhoused",
        "sin vivienda",
        "sin hogar",
        "campamento",
        "refugio esta noche",
        "albergue",
        "outreach",
        "durmiendo en el callejon",
        "sleeping in the alley",
        "tent on the sidewalk",
        "casa de campana",
        "living in a car",
        "vive en un carro",
        "need medical help",
        "necesitar ayuda medica",
        "come help someone",
        "venga alguien a ayudar",
        "shelter information",
        "informacion de refugio",
        "quien ayuda a la gente"
      ],
      medium: [
        "sleeping in the alley",
        "living in a car on our street",
        "needs services",
        "about to lose their place",
        "tent on the sidewalk",
        "who helps people living on the street",
        "shelter information",
        "durmiendo en el callejon",
        "vive en un carro",
        "necesita servicios",
        "va a perder su casa",
        "casa de campana en la banqueta",
        "quien ayuda a la gente que vive en la calle",
        "informacion de refugio"
      ],
      weak: ["shelter", "tent", "refugio", "campamento"]
    }
  ];
  var EXTENDED_QUESTIONS = {
    graffiti: {
      en: "Is the graffiti on a public surface such as a wall, pole, or sidewalk, rather than inside a private building?",
      es: "\xBFEl grafiti est\xE1 en una superficie p\xFAblica como una pared, poste o banqueta, y no dentro de un edificio privado?"
    },
    abandoned_vehicle: {
      en: "Has the vehicle been parked in the same public spot for more than 72 hours, rather than being someone\u2019s car in normal use?",
      es: "\xBFEl veh\xEDculo lleva m\xE1s de 72 horas en el mismo lugar p\xFAblico, en vez de ser un carro que alguien usa normalmente?"
    },
    sidewalk: {
      en: "Is the damage on the walking surface \u2014 the sidewalk or curb ramp \u2014 rather than in the street where cars drive?",
      es: "\xBFEl da\xF1o est\xE1 en la superficie para caminar \u2014 la banqueta o la rampa \u2014 y no en la calle donde pasan los carros?"
    },
    street_tree: {
      en: "Is the tree in the parkway strip between the sidewalk and the street, rather than inside a private yard?",
      es: "\xBFEl \xE1rbol est\xE1 en la franja entre la banqueta y la calle, y no dentro de un patio privado?"
    },
    traffic_sign_signal: {
      en: "Is this about a traffic signal, street sign, or road marking, rather than a streetlight that lights the block?",
      es: "\xBFSe trata de un sem\xE1foro, letrero o marca vial, y no de una luminaria que alumbra la cuadra?"
    },
    storm_drain: {
      en: "Is the water rain water collecting in the street, rather than sewage or drinking water?",
      es: "\xBFEl agua es de lluvia acumulada en la calle, y no aguas negras ni agua potable?"
    },
    bulky_item: {
      en: "Is this your own large item that you want collected, rather than something someone else dumped?",
      es: "\xBFEs un art\xEDculo grande suyo que quiere que recojan, y no algo que otra persona tir\xF3?"
    },
    recycling_ewaste: {
      en: "Are you asking where to take an item for recycling or safe disposal, rather than reporting something already dumped?",
      es: "\xBFPregunta d\xF3nde llevar algo para reciclar o desechar de forma segura, y no reporta algo ya tirado?"
    },
    animal_control: {
      en: "Is this about a loose, injured, or dead animal, rather than a neighbour\u2019s property conditions?",
      es: "\xBFSe trata de un animal suelto, herido o muerto, y no de las condiciones de la propiedad de un vecino?"
    },
    code_violation: {
      en: "Is the problem the condition of a property \u2014 overgrowth, junk, vacancy, or unpermitted work \u2014 rather than something in the street?",
      es: "\xBFEl problema es la condici\xF3n de una propiedad \u2014 maleza, cochinero, abandono u obra sin permiso \u2014 y no algo en la calle?"
    },
    housing_help: {
      en: "Are you looking for help with rent, a housing programme, or conditions in a home you rent?",
      es: "\xBFBusca ayuda con la renta, un programa de vivienda, o las condiciones de una casa que renta?"
    },
    parking_citation: {
      en: "Did you receive a parking citation you want to pay or appeal, rather than reporting a car left on the street?",
      es: "\xBFRecibi\xF3 una multa de estacionamiento que quiere pagar o apelar, y no reporta un carro abandonado?"
    },
    utility_billing: {
      en: "Is this about your bill or account, rather than the water itself \u2014 its colour, smell, or pressure?",
      es: "\xBFSe trata de su recibo o cuenta, y no del agua en s\xED \u2014 su color, olor o presi\xF3n?"
    },
    business_permit: {
      en: "Are you applying for a licence or permit yourself, rather than reporting work someone else did without one?",
      es: "\xBFUsted va a solicitar una licencia o permiso, en vez de reportar una obra que alguien hizo sin permiso?"
    },
    public_records: {
      en: "Are you asking for a copy of a document or meeting record, rather than reporting a problem in the neighbourhood?",
      es: "\xBFPide una copia de un documento o registro de una junta, y no reporta un problema en el vecindario?"
    },
    power_outage: {
      en: "Is the electricity out in your home or on your block, rather than a streetlight being dark?",
      es: "\xBFFalta la electricidad en su casa o su cuadra, y no se trata de una luminaria apagada?"
    },
    homeless_outreach: {
      en: "Would you like outreach workers to connect someone with services, rather than reporting property or trash?",
      es: "\xBFQuiere que trabajadores comunitarios conecten a alguien con servicios, en vez de reportar propiedad o basura?"
    }
  };

  // lib/classifier.ts
  var CONFIDENCE_ROUTE = 0.85;
  var CONFIDENCE_CLARIFY = 0.6;
  var EMERGENCY_SIGNALS = [
    // English
    "fire",
    "on fire",
    "burning",
    "smoke coming",
    "flames",
    "in flames",
    "up in flames",
    "gas leak",
    "smell gas",
    "smells like gas",
    "natural gas",
    "gun",
    "gunshot",
    "shooting",
    "shots fired",
    "heart attack",
    "not breathing",
    "unconscious",
    "passed out",
    "downed power line",
    "power line down",
    "live wire",
    "wire is down",
    "sparking",
    "arcing",
    "electrocuted",
    "sinkhole",
    "road collapsed",
    "pavement collapsed",
    "sewage in my house",
    "sewage inside",
    "sewage in the house",
    "flooding my house",
    "house is flooding",
    "water main burst",
    "someone is hurt",
    "someone is injured",
    "bleeding",
    // v2: real phrasings that slipped the gate on the dev corpus. Present tense
    // only — "someone could get hurt" is a hypothetical and must NOT gate.
    "somebody is hurt",
    "somebody got hurt",
    "someone got hurt",
    "person is hurt",
    "is unconscious",
    "not breathing",
    "needles",
    "syringes",
    "biohazard",
    "hazardous chemical",
    "chemical drum",
    "asbestos",
    "trapped",
    "emergency",
    // Spanish
    "incendio",
    "fuego",
    "se esta quemando",
    "humo",
    "llamas",
    "en llamas",
    "fuga de gas",
    "huele a gas",
    "disparos",
    "balazos",
    "pistola",
    "ataque al corazon",
    "no respira",
    "inconsciente",
    "desmayado",
    "cable caido",
    "cable de luz caido",
    "chispas",
    "socavon",
    "la calle se hundio",
    "aguas negras en mi casa",
    "aguas negras adentro",
    "se esta inundando mi casa",
    "inundacion",
    // NOTE: 'hay un herido' and bare 'esta herido' were removed — the matcher
    // tolerates one filler word, so they fired on "hay un gato herido". An
    // injured animal is an animal-control call, not an emergency.
    "alguien esta herido",
    "alguien herido",
    "persona herida",
    "hay una persona herida",
    "sangrando",
    "jeringas",
    "agujas",
    "quimico peligroso",
    "asbesto",
    "atrapado",
    "emergencia"
  ];
  var EMERGENCY_COOCCURRENCE = [
    {
      a: ["power line", "powerline", "electrical line", "cable de luz", "linea electrica"],
      b: ["down", "downed", "on the ground", "caido", "caida", "en el suelo"],
      label: "downed power line"
    },
    {
      a: ["wire", "wires", "cable", "cables"],
      b: [
        "down",
        "downed",
        "on the ground",
        "sparking",
        "arcing",
        "popping",
        "hanging",
        "hanging down",
        "hanging from",
        "caido",
        "caida",
        "en el suelo",
        "chispas",
        "chispeando",
        "echando chispas",
        "colgando"
      ],
      label: "downed, hanging or sparking wire"
    },
    {
      a: ["sewage", "aguas negras", "raw sewage"],
      b: [
        "in my house",
        "in the house",
        "inside",
        "in my home",
        // v2.1 — real phrasings that slipped the gate on the frozen corpus
        "into my house",
        "into the house",
        "into my home",
        "into my apartment",
        "coming up through",
        "shower drain",
        "through the shower",
        "in the tub",
        "in the bathroom",
        "toilet",
        "floor drain",
        "en mi casa",
        "adentro",
        "dentro de mi casa",
        "dentro de la casa",
        "por la regadera",
        "en la regadera",
        "en el bano",
        "por el inodoro"
      ],
      // Residents often say where it is NOT. Do not gate on a denial.
      unless: [
        "not inside",
        "not in my house",
        "not in the house",
        "not in my home",
        "no adentro",
        "no dentro de mi casa",
        "no en mi casa",
        "no es adentro"
      ],
      label: "sewage inside a home"
    },
    {
      a: ["gas"],
      b: ["leak", "smell", "smells", "fuga", "huele"],
      label: "gas leak"
    },
    // ---- v2 additions, all driven by missed emergencies on the dev corpus ----
    {
      a: ["water main", "main line", "main water line", "tuberia principal", "linea principal"],
      b: [
        "broke",
        "break",
        "broken",
        "burst",
        "busted",
        "ruptured",
        "se rompio",
        "rompio",
        "revento",
        "reventada",
        "reventado",
        "rota"
      ],
      label: "water main break"
    },
    {
      a: ["flooding", "flooded", "flood", "inundando", "inundandose", "inundacion"],
      b: [
        "my house",
        "my home",
        "my garage",
        "my apartment",
        "my unit",
        "into my",
        "inside",
        "mi casa",
        "mi cochera",
        "mi garage",
        "mi departamento",
        "adentro",
        "se esta"
      ],
      label: "flooding into a building"
    }
  ];
  var CORE_RULES = [
    {
      id: "illegal_dumping",
      strong: [
        "illegal dumping",
        "dumped",
        "dumping",
        "fly tipping",
        "descarga ilegal",
        "tiraron",
        "tiro basura",
        "tirando basura",
        // v2
        "dropped off",
        "dumped on",
        "tiradero",
        "tiro escombro",
        "escombro de construccion",
        "using it as a dump",
        "lo dejaron",
        "dejaron tirado",
        "colchon tirado",
        "tirado en la banqueta",
        "semanas tirado",
        "se lleva un colchon"
      ],
      medium: [
        "couch in the alley",
        "mattress on the sidewalk",
        "furniture on the curb",
        "construction debris",
        "old tires",
        "abandoned appliances",
        "trash in the alley",
        "garbage in the alley",
        "left on the curb",
        "leaving trash",
        "bags of garbage",
        "thrown in the alley",
        "appliances abandoned",
        "abandoned on the street",
        "dumped on the street",
        "dejando basura",
        "bolsas de basura",
        "tiradas en el callejon",
        "abandonados en la calle",
        "sofa en el callejon",
        "colchon en la banqueta",
        "muebles abandonados",
        "escombros",
        "llantas viejas",
        "basura en el callejon",
        "electrodomesticos abandonados",
        // v2 — phrasings residents actually used on the dev corpus
        "pile of",
        "piling up",
        "junk piling",
        "household junk",
        "junk on the curb",
        "yard waste and",
        "broken chairs",
        "concrete chunks",
        "drywall",
        "left their furniture",
        "left all their furniture",
        "on the parkway",
        "empty lot",
        "vacant lot",
        "unloaded",
        "stuff shows up",
        "stuff on the",
        "abandoned in the alley",
        "blocking the alley",
        "blocking half the alley",
        "somebody left",
        "someone left",
        "someone put",
        "lote baldio",
        "terreno vacio",
        "monton de",
        "sillas rotas",
        "cochinada",
        "parece basurero",
        "se esta juntando",
        "dejaron un",
        "dejaron todos",
        "dejaron sus muebles",
        "aparecio atras",
        "lo trajo y lo dejo",
        "tapando el callejon",
        "en el callejon"
      ],
      weak: [
        "mattress",
        "couch",
        "sofa",
        "furniture",
        "debris",
        "tires",
        "colchon",
        "muebles",
        "llantas",
        "appliances",
        "electrodomesticos",
        // v2
        "junk",
        "dump",
        "dumped",
        "escombro",
        "ramas",
        "tiradero",
        "basurero",
        "refrigerator",
        "refrigerador",
        "washer",
        "lavadora",
        "secadora",
        "bbq",
        "asador"
      ]
    },
    {
      id: "pothole",
      strong: [
        "pothole",
        "potholes",
        "bache",
        "baches"
      ],
      medium: [
        "hole in the street",
        "hole in the road",
        "road is broken",
        "pavement is cracked",
        "asphalt is coming apart",
        "crater in the street",
        "dip in the road",
        "street needs repaving",
        "damaged my tire",
        "hoyo en la calle",
        "la calle esta rota",
        "pavimento agrietado",
        "crater en la calle",
        "hundimiento en la calle",
        "da\xF1o mi llanta",
        "necesita repavimentacion",
        "el asfalto se esta deshaciendo",
        // v2
        "hoyo de la calle",
        "hole again",
        "broken up",
        "all broken up",
        "repave",
        "repaving",
        "broken section",
        "broken pavement",
        "pavement is falling apart",
        "pavement is cracked",
        "road surface",
        "street damage",
        "road is sunken",
        "sunken",
        "caved in",
        "asphalt caved",
        "dip in the pavement",
        "bad dip",
        "cars bounce",
        "wrecks cars",
        "messed up my tire",
        "bent my rim",
        "scrapes her bumper",
        "shakes the whole bus",
        "patched it",
        "patched the street",
        "street with dirt",
        "repavimentar",
        "repavimentacion",
        "parcharon",
        "pedazo roto",
        "pavimento se hundio",
        "se hundio el pavimento",
        "la calle esta hundida",
        "calle danada",
        "la calle esta danada",
        "los carros brincan",
        "arruina los carros",
        "dano la llanta",
        "se me doblo el rin",
        "sacude el camion",
        "taparon la calle",
        "la calle quedo hundida",
        "esta agrietada"
      ],
      weak: [
        "pavement",
        "asphalt",
        "roadway",
        "pavimento",
        "asfalto",
        "calzada",
        "hundimiento",
        // v2
        "hoyo",
        "crater",
        "rin",
        "llanta",
        "carpeta",
        "bump"
      ]
    },
    {
      id: "streetlight",
      strong: [
        "streetlight",
        "street light",
        "street lamp",
        "lamp post",
        "lamppost",
        "luminaria",
        "poste de luz",
        "luz de la calle",
        "lampara de la calle"
      ],
      medium: [
        "light is out",
        "light has been out",
        "lights are out",
        "burned out",
        "block is dark",
        "street is dark",
        "pitch black",
        "no light on the street",
        "light flickers",
        "stays on during the day",
        "la luz esta apagada",
        "lleva apagada",
        "la cuadra esta oscura",
        "la calle esta oscura",
        "muy oscuro",
        "no hay luz en la calle",
        "la luz parpadea",
        "se queda encendida de dia",
        "se quemo la luz",
        // v2
        "lights in a row",
        "no lighting",
        "lighting is out",
        "street lighting",
        "lighting on our block",
        "pole light",
        "light on the pole",
        "light by the",
        "lamp on the corner",
        "lights just dont come on",
        "stays on all day",
        "burnt out",
        "burned out",
        "flickering",
        "replace the bulb",
        "dark at night",
        "pitch dark",
        "cant see the steps",
        "no light",
        "no hay alumbrado",
        "alumbrado publico",
        "esta apagada",
        "estan apagadas",
        "lleva un mes apagada",
        "ya no encienden",
        "no encienden",
        "esta fundida",
        "cambiar el foco",
        "se murio el farol",
        "farol de la calle",
        "luz del poste",
        "oscurisima",
        "oscura de noche",
        "parpadeando",
        "se queda prendida",
        "prende y apaga",
        "dejo de servir",
        "apagado desde"
      ],
      weak: [
        "pole",
        "dark",
        "poste",
        "oscuro",
        "oscura",
        // v2
        "lighting",
        "lamp",
        "alumbrado",
        "lampara",
        "farol",
        "foco",
        "bulb",
        "luminaria",
        "flickering",
        "parpadeando",
        "apagada",
        "apagadas"
      ]
    },
    {
      id: "missed_trash",
      strong: [
        "missed trash",
        "missed pickup",
        "trash was skipped",
        "skipped our block",
        "garbage truck did not come",
        "not picked up",
        "was not picked up",
        "did not pick up",
        "no recogieron",
        "recoleccion omitida",
        "omitieron",
        "no vinieron por la basura",
        "el camion de basura no vino",
        // v2
        "skipped",
        "se salto mi casa",
        "skipped my house",
        "drove right past",
        "nobody picked up",
        "never picked up",
        "has not been emptied",
        "not been emptied",
        "never got emptied",
        "nobody came for the trash",
        "no collection",
        "pickup missed",
        "missed our",
        "se saltaron",
        "no pasaron",
        "nadie recogio",
        "no vaciaron",
        "no lo vacian",
        "no ha habido recoleccion",
        "nadie vino por la basura"
      ],
      medium: [
        "trash has not been collected",
        "carts are still full",
        "bins are still full",
        "recycling was not picked up",
        "green waste",
        "only took one of our carts",
        "no trash pickup",
        "garbage service skipped",
        "los botes siguen llenos",
        "no han recogido la basura",
        "no recogieron el reciclaje",
        "bote de jardin",
        "servicio de basura omitio",
        // v2
        "cans are overflowing",
        "overflowing",
        "garbage service",
        "waste pickup",
        "collection day",
        "regular day",
        "holiday schedule",
        "still sitting at the curb",
        "still out",
        "left the black container",
        "only emptied",
        "only took",
        "knocked over my container",
        "dumpster is packed",
        "cant fit any more",
        "trash on the ground",
        "service still active",
        "came down the street",
        "truck came through",
        "left the trash",
        "servicio de basura",
        "dia de recoleccion",
        "dia normal",
        "dia festivo",
        "se estan derramando",
        "hasta el tope",
        "siguen llenos",
        "siguen afuera",
        "tumbaron mi contenedor",
        "basura tirada sin recogerla",
        "ya no cabe nada",
        "no vino esta semana",
        "esperando la recoleccion",
        "sigue activo el servicio"
      ],
      weak: [
        "cart",
        "carts",
        "bin",
        "bins",
        "pickup",
        "collection",
        "bote",
        "botes",
        "recoleccion",
        // v2
        // 'truck'/'camion' deliberately excluded: they matched "food truck" on the
        // out-of-scope probe set. Truck context is carried by the strong phrases.
        "emptied",
        "container",
        "contenedor",
        "dumpster",
        "reciclaje"
      ]
    },
    {
      id: "water_or_sewer",
      strong: [
        "sewage",
        "sewer",
        "water leak",
        "water main",
        "manhole",
        "aguas negras",
        "alcantarilla",
        "alcantarillado",
        "fuga de agua",
        "drenaje",
        "tuberia principal"
      ],
      medium: [
        "water is leaking",
        "water pressure",
        "water looks brown",
        "water is brown",
        "puddle that never dries",
        "backing up",
        "drain smells",
        "strange taste",
        "water has a taste",
        "sewage smell",
        "smells like sewage",
        "presion del agua",
        "el agua se ve cafe",
        "charco que nunca se seca",
        "se esta regresando",
        "el drenaje huele",
        "sabor extra\xF1o",
        "olor a aguas negras",
        // v2
        "water bubbling",
        "bubbling up out of the street",
        "wet patch",
        "wet spot",
        "standing water",
        "cloudy water",
        "white specks",
        "seeping out",
        "manhole cover",
        "fire hydrant",
        "dripping",
        "water bill",
        "leak on the city side",
        "pressure dropped",
        "barely a trickle",
        "smells like a bathroom",
        "sewer smell",
        "sewage odor",
        "always wet",
        "agua burbujeando",
        "sale agua",
        "agua estancada",
        "agua turbia",
        "puntitos blancos",
        "coladera",
        "hidrante",
        "goteando",
        "recibo del agua",
        "bajo la presion",
        "apenas escurre",
        "huele a bano",
        "olor a drenaje",
        "siempre esta mojado",
        "saliendo agua",
        "se esta tapando"
      ],
      weak: [
        "water",
        "drain",
        "leak",
        "agua",
        "fuga",
        // v2
        "coladera",
        "hidrante",
        "presion",
        "drenaje",
        "sewer",
        "sewage",
        "mosquitos",
        "moscos"
      ]
    }
  ];
  var RULES = [...CORE_RULES, ...EXTENDED_RULES];
  var WEIGHTS = { strong: 3, medium: 2, weak: 1 };
  var CORE_QUESTIONS = {
    illegal_dumping: {
      en: "Is the material sitting on public property such as an alley, sidewalk, or street, rather than inside a private yard?",
      es: "\xBFEl material est\xE1 en propiedad p\xFAblica como un callej\xF3n, banqueta o calle, y no dentro de un patio privado?"
    },
    pothole: {
      en: "Is the damage in the paved roadway itself, rather than on a sidewalk or driveway?",
      es: "\xBFEl da\xF1o est\xE1 en la calzada pavimentada, y no en una banqueta o entrada de auto?"
    },
    streetlight: {
      en: "Is this a streetlight on a public pole, rather than a light on a house or private building?",
      es: "\xBFEs una luminaria en un poste p\xFAblico, y no una luz de una casa o edificio privado?"
    },
    missed_trash: {
      en: "Were your carts out on your scheduled pickup day and left uncollected, rather than extra items the service does not take?",
      es: "\xBFSus botes estaban afuera el d\xEDa programado y no los recogieron, en vez de art\xEDculos extra que el servicio no lleva?"
    },
    water_or_sewer: {
      en: "Is the water or odor problem coming from the street or a public line, rather than plumbing inside your home?",
      es: "\xBFEl problema de agua u olor viene de la calle o de una l\xEDnea p\xFAblica, y no de la plomer\xEDa dentro de su casa?"
    }
  };
  var CLARIFYING_QUESTIONS = {
    ...CORE_QUESTIONS,
    ...EXTENDED_QUESTIONS
  };
  function normalize(input) {
    return input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñ\s]/g, " ").replace(/\s+/g, " ").trim();
  }
  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function containsPhrase(haystack, phrase) {
    const p = normalize(phrase);
    if (!p) return false;
    const tokens = p.split(" ").map(escapeRegExp);
    if (tokens.length === 1) {
      return new RegExp(`(?:^|\\s)${tokens[0]}(?:\\s|$)`).test(haystack);
    }
    const pattern = tokens.join("(?:\\s+\\S+)?\\s+");
    return new RegExp(`(?:^|\\s)${pattern}(?:\\s|$)`).test(haystack);
  }
  var EMERGENCY_WORD_COMPOUNDS = [
    [/\bfire hydrant(s)?\b/g, " hydrant "],
    [/\bfire station(s)?\b/g, " station "],
    [/\bfire department\b/g, " department "],
    [/\bfire lane(s)?\b/g, " lane "],
    [/\bfire escape(s)?\b/g, " escape "],
    [/\bhidrante(s)? contra incendios?\b/g, " hidrante "],
    [/\bestacion de bomberos\b/g, " bomberos "]
  ];
  function detectEmergency(input) {
    var _a;
    let text = normalize(input);
    if (!text) return null;
    for (const [re, replacement] of EMERGENCY_WORD_COMPOUNDS) text = text.replace(re, replacement);
    text = text.replace(/\s+/g, " ").trim();
    for (const signal of EMERGENCY_SIGNALS) {
      if (containsPhrase(text, signal)) return signal;
    }
    for (const rule of EMERGENCY_COOCCURRENCE) {
      if ((_a = rule.unless) == null ? void 0 : _a.some((t) => containsPhrase(text, t))) continue;
      const hasA = rule.a.some((t) => containsPhrase(text, t));
      const hasB = rule.b.some((t) => containsPhrase(text, t));
      if (hasA && hasB) return rule.label;
    }
    return null;
  }
  function scoreAll(text) {
    return RULES.map((rule) => {
      let score = 0;
      for (const p of rule.strong) if (containsPhrase(text, p)) score += WEIGHTS.strong;
      for (const p of rule.medium) if (containsPhrase(text, p)) score += WEIGHTS.medium;
      for (const p of rule.weak) if (containsPhrase(text, p)) score += WEIGHTS.weak;
      return { id: rule.id, score };
    }).sort((a, b) => b.score - a.score || SERVICE_IDS.indexOf(a.id) - SERVICE_IDS.indexOf(b.id));
  }
  function computeConfidence(top, runnerUp) {
    let base;
    if (top >= 5) base = 0.95;
    else if (top >= 3) base = 0.9;
    else if (top === 2) base = 0.78;
    else base = 0.62;
    if (runnerUp === 0) return base;
    const margin = (top - runnerUp) / top;
    if (margin <= 0) return 0.45;
    if (margin < 0.4) return Math.min(base, 0.58);
    if (margin < 0.7) return Math.min(base, 0.8);
    return base;
  }
  function classifyResidentText(input) {
    var _a;
    if (typeof input !== "string" || !normalize(input)) {
      return { kind: "unsupported", confidence: 0, reason: "empty_input" };
    }
    const emergency = detectEmergency(input);
    if (emergency) {
      return { kind: "emergency", matchedSignal: emergency, confidence: 1 };
    }
    const text = normalize(input);
    const scored = scoreAll(text);
    const [top, second] = scored;
    if (!top || top.score === 0) {
      return { kind: "unsupported", confidence: 0, reason: "no_signal" };
    }
    const runnerUp = (_a = second == null ? void 0 : second.score) != null ? _a : 0;
    const confidence = computeConfidence(top.score, runnerUp);
    const alternates = scored.filter((s) => s.id !== top.id && s.score > 0).map((s) => s.id);
    if (confidence >= CONFIDENCE_ROUTE) {
      return { kind: "routed", serviceId: top.id, confidence, alternates };
    }
    if (confidence >= CONFIDENCE_CLARIFY) {
      return {
        kind: "clarify",
        serviceId: top.id,
        confidence,
        alternates,
        question: CLARIFYING_QUESTIONS[top.id]
      };
    }
    const fallback = SERVICE_IDS.find((id) => id !== top.id);
    const secondOption = second && second.score > 0 ? second.id : fallback;
    return { kind: "ambiguous", options: [top.id, secondOption], confidence };
  }
  function resolveRoute(c) {
    if (c.kind === "routed" || c.kind === "clarify") {
      if (!isSupportedServiceId(c.serviceId)) {
        throw new Error("Classifier produced an id outside the catalog");
      }
      return serviceCatalog[c.serviceId];
    }
    return null;
  }

  // lib/receipt.ts
  var STATUS_SEQUENCE = [
    "HEARD",
    "CLASSIFIED",
    "READY",
    "SUBMITTED",
    "FOLLOW-UP DUE",
    "RESOLVED"
  ];
  var DISCLOSURE = {
    en: "Hackathon prototype: this app prepares and tracks your action. It does not submit directly to the City of Compton.",
    es: "Prototipo de hackathon: esta aplicaci\xF3n prepara y da seguimiento a su acci\xF3n. No env\xEDa nada directamente a la Ciudad de Compton."
  };
  function sanitizeResidentText(input, maxLength = 400) {
    if (typeof input !== "string") return "";
    const cleaned = input.replace(/[\u0000-\u001f\u007f-\u009f]/g, " ").replace(/[<>{}\\`]/g, " ").replace(/["'\u201c\u201d\u2018\u2019]/g, "").replace(/\s+/g, " ").trim();
    return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength).trimEnd()}\u2026` : cleaned;
  }
  function addBusinessDays(from, days) {
    const d = new Date(from.getTime());
    let added = 0;
    while (added < days) {
      d.setDate(d.getDate() + 1);
      const day = d.getDay();
      if (day !== 0 && day !== 6) added += 1;
    }
    return d;
  }
  function generateCaseId(seed) {
    const n = typeof seed === "number" ? seed : Math.floor(Math.random() * 9e3) + 1e3;
    return `C1-${String(n).padStart(4, "0")}`;
  }
  function checkpointDays(route2) {
    return route2.domain === "waste" || route2.domain === "water" ? 2 : 5;
  }
  function buildScript(route2, summary, lang) {
    const title = route2.title[lang].toLowerCase();
    if (lang === "es") {
      return [
        `Hola, llamo para reportar un problema de ${title} en Compton.`,
        summary ? `Lo que ocurri\xF3: ${summary}` : "",
        "Tengo la ubicaci\xF3n, la fecha y la evidencia lista.",
        "\xBFMe puede dar un n\xFAmero de solicitud o confirmaci\xF3n, y decirme cu\xE1l es el siguiente paso?"
      ].filter(Boolean).join(" ");
    }
    return [
      `Hello, I am calling to report a ${title} issue in Compton.`,
      summary ? `Here is what happened: ${summary}` : "",
      "I have the location, the date, and my evidence ready.",
      "Can I get a service request or confirmation number, and what happens next?"
    ].filter(Boolean).join(" ");
  }
  function buildReceipt(residentText, classification, options = {}) {
    var _a, _b;
    const lang = (_a = options.lang) != null ? _a : "en";
    const now = (_b = options.now) != null ? _b : /* @__PURE__ */ new Date();
    if (classification.kind === "emergency") {
      const g = EMERGENCY_GUIDANCE[lang];
      return {
        kind: "emergency",
        heading: g.heading,
        body: g.body,
        emergency: g.emergency,
        sheriff: g.sheriff,
        sourceUrl: EMERGENCY_GUIDANCE.source.url
      };
    }
    const route2 = resolveRoute(classification);
    if (!route2) return null;
    const summary = sanitizeResidentText(residentText);
    const days = checkpointDays(route2);
    const followUp = addBusinessDays(now, days);
    return {
      kind: "action",
      caseId: generateCaseId(options.caseIdSeed),
      status: "READY",
      serviceId: route2.serviceId,
      title: route2.title[lang],
      owner: route2.responsibleEntity,
      jurisdiction: route2.jurisdiction,
      residentSummary: summary,
      confidence: classification.confidence,
      intakeMethods: route2.intakeMethods.map((m) => ({
        type: m.type,
        label: m.label[lang],
        destination: m.destination,
        reaches: m.reaches,
        appliesWhen: m.appliesWhen ? m.appliesWhen[lang] : null,
        verificationState: m.verificationState,
        lastVerifiedAt: m.lastVerifiedAt
      })),
      evidence: route2.evidenceRequirements[lang],
      prohibited: route2.prohibitedData[lang],
      emergencyExclusions: route2.emergencyExclusions,
      script: buildScript(route2, summary, lang),
      expectedConfirmation: route2.expectedConfirmation ? route2.expectedConfirmation[lang] : null,
      followUpCheckpoint: route2.followUpPolicy.residentCheckpoint[lang],
      followUpDate: followUp.toISOString().slice(0, 10),
      officialSlaConfirmed: route2.followUpPolicy.officialSlaConfirmed,
      sources: route2.sourceReferences.map((s) => ({ ...s })),
      maintainer: route2.maintainer,
      nextReviewAt: route2.nextReviewAt,
      disclosure: DISCLOSURE[lang]
    };
  }

  // lib/analytics.ts
  var ANALYTICS_EVENTS = [
    "report_started",
    "language_selected",
    "issue_description_entered",
    "clarification_shown",
    "route_recommended",
    "route_manually_selected",
    "evidence_checklist_completed",
    "official_handoff_opened",
    "confirmation_saved",
    "follow_up_scheduled",
    "case_reopened",
    "case_marked_resolved",
    "case_deleted",
    "error_shown",
    /** Extension to the master-prompt list. See DECISIONS.md D-010. */
    "emergency_gate_shown"
  ];
  var ALLOWED_PROPERTIES = {
    report_started: ["entry", "lang"],
    language_selected: ["lang", "from"],
    issue_description_entered: ["lang", "length_bucket", "input_mode"],
    clarification_shown: ["service_id", "confidence_band", "lang"],
    route_recommended: ["service_id", "confidence_band", "jurisdiction", "lang"],
    route_manually_selected: ["service_id", "origin", "lang"],
    evidence_checklist_completed: ["service_id", "item_count", "lang"],
    official_handoff_opened: ["service_id", "method_type", "verification_state", "lang"],
    confirmation_saved: ["service_id", "lang"],
    follow_up_scheduled: ["service_id", "days_ahead", "lang"],
    case_reopened: ["service_id", "lang"],
    case_marked_resolved: ["service_id", "lang"],
    case_deleted: ["service_id", "lang"],
    error_shown: ["error_code", "view", "lang"],
    emergency_gate_shown: ["trigger_class", "lang"]
  };
  var TOKEN_GRAMMAR = /^[a-z0-9_.:-]{1,40}$/i;
  var MAX_RECORDS = 250;
  var AnalyticsContractError = class extends Error {
  };
  function isAnalyticsEvent(name) {
    return ANALYTICS_EVENTS.includes(name);
  }
  function lengthBucket(chars) {
    if (chars <= 0) return "empty";
    if (chars < 40) return "short";
    if (chars < 140) return "medium";
    return "long";
  }
  function confidenceBand(confidence) {
    if (confidence >= 0.85) return "high";
    if (confidence >= 0.6) return "medium";
    return "low";
  }
  var AnalyticsRecorder = class {
    /** `strict` throws on a contract breach; used in tests and development. */
    constructor(strict = false, now = () => Date.now()) {
      this.strict = strict;
      this.records = [];
      this.rejections = {
        unknown_event: 0,
        property_not_allowed: 0,
        value_not_a_token: 0,
        value_wrong_type: 0
      };
      this.seq = 0;
      this.now = now;
      this.started = now();
    }
    track(event, props = {}) {
      if (!isAnalyticsEvent(event)) return this.reject("unknown_event", event);
      const allowed = ALLOWED_PROPERTIES[event];
      const clean = {};
      for (const key of Object.keys(props)) {
        if (!allowed.includes(key)) return this.reject("property_not_allowed", `${event}.${key}`);
        const value = props[key];
        if (typeof value === "number") {
          if (!Number.isFinite(value)) return this.reject("value_wrong_type", `${event}.${key}`);
          clean[key] = value;
          continue;
        }
        if (typeof value === "boolean") {
          clean[key] = value;
          continue;
        }
        if (typeof value !== "string") return this.reject("value_wrong_type", `${event}.${key}`);
        if (!TOKEN_GRAMMAR.test(value)) return this.reject("value_not_a_token", `${event}.${key}`);
        clean[key] = value;
      }
      const record = {
        seq: ++this.seq,
        event,
        atMs: Math.max(0, this.now() - this.started),
        props: clean
      };
      this.records.push(record);
      if (this.records.length > MAX_RECORDS) this.records.shift();
      return { ok: true, record };
    }
    reject(reason, detail) {
      this.rejections[reason]++;
      if (this.strict) throw new AnalyticsContractError(`${reason}: ${detail}`);
      return { ok: false, reason, detail };
    }
    drain() {
      return this.records.slice();
    }
    rejectionCounts() {
      return { ...this.rejections };
    }
    reset() {
      this.records = [];
      this.seq = 0;
      this.started = this.now();
    }
    count(event) {
      return this.records.filter((r) => r.event === event).length;
    }
    /**
     * The funnel from the analytics contract. Counts are session counts, not
     * population estimates, and the dashboard must label them as such.
     */
    funnel() {
      const stages = [
        ["Intake started", "report_started"],
        ["Issue described", "issue_description_entered"],
        ["Route recommended", "route_recommended"],
        ["Evidence prepared", "evidence_checklist_completed"],
        ["Official action opened", "official_handoff_opened"],
        ["Confirmation recorded", "confirmation_saved"],
        ["Outcome verified", "case_marked_resolved"]
      ];
      return stages.map(([stage, event]) => ({ stage, event, count: this.count(event) }));
    }
  };
  var analytics = new AnalyticsRecorder(false);

  // lib/storage.ts
  var STORAGE_KEY = "c1fix.cases.v1";
  var SCHEMA_VERSION = 1;
  var MAX_CASES = 50;
  var CaseStore = class {
    constructor(backend) {
      this.backend = backend;
      this.memory = null;
      /** True when the backend rejected a write (private mode, quota, disabled). */
      this.degraded = false;
    }
    // ---------------------------------------------------------------- consent
    isEnabled() {
      return this.read() !== null;
    }
    /** Opt in. This is the only call that creates the storage key. */
    enable(now = /* @__PURE__ */ new Date()) {
      const payload = { version: SCHEMA_VERSION, consentAt: now.toISOString(), cases: [] };
      return this.write(payload);
    }
    /** Opt out and erase. Not a soft delete — the key is removed. */
    wipe() {
      var _a;
      this.memory = null;
      try {
        (_a = this.backend) == null ? void 0 : _a.removeItem(STORAGE_KEY);
      } catch (e) {
      }
    }
    consentedAt() {
      var _a, _b;
      return (_b = (_a = this.read()) == null ? void 0 : _a.consentAt) != null ? _b : null;
    }
    // ---------------------------------------------------------------- cases
    list() {
      const p = this.read();
      if (!p) return [];
      return p.cases.slice().sort((a, b) => a.updatedAt < b.updatedAt ? 1 : -1);
    }
    get(caseId) {
      var _a;
      return (_a = this.list().find((c) => c.caseId === caseId)) != null ? _a : null;
    }
    /** Insert or update by caseId. No-op when storage is off. */
    save(c) {
      const p = this.read();
      if (!p) return false;
      const i = p.cases.findIndex((x) => x.caseId === c.caseId);
      if (i >= 0) p.cases[i] = c;
      else p.cases.unshift(c);
      if (p.cases.length > MAX_CASES) p.cases.length = MAX_CASES;
      return this.write(p);
    }
    remove(caseId) {
      const p = this.read();
      if (!p) return false;
      const before = p.cases.length;
      p.cases = p.cases.filter((c) => c.caseId !== caseId);
      if (p.cases.length === before) return false;
      return this.write(p);
    }
    count() {
      var _a, _b;
      return (_b = (_a = this.read()) == null ? void 0 : _a.cases.length) != null ? _b : 0;
    }
    // ---------------------------------------------------------------- internals
    read() {
      if (this.memory) return this.memory;
      if (!this.backend) return null;
      let raw = null;
      try {
        raw = this.backend.getItem(STORAGE_KEY);
      } catch (e) {
        this.degraded = true;
        return null;
      }
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw);
        if (!parsed || parsed.version !== SCHEMA_VERSION || !Array.isArray(parsed.cases) || typeof parsed.consentAt !== "string") {
          this.wipe();
          return null;
        }
        parsed.cases = parsed.cases.filter(
          (c) => c && typeof c.caseId === "string" && typeof c.serviceId === "string"
        );
        this.memory = parsed;
        return parsed;
      } catch (e) {
        this.wipe();
        return null;
      }
    }
    write(p) {
      this.memory = p;
      if (!this.backend) {
        this.degraded = true;
        return false;
      }
      try {
        this.backend.setItem(STORAGE_KEY, JSON.stringify(p));
        this.degraded = false;
        return true;
      } catch (e) {
        this.degraded = true;
        return false;
      }
    }
  };
  function createCaseStore() {
    let backend = null;
    try {
      const g = globalThis;
      if (g.localStorage) {
        const probe = "__c1probe__";
        g.localStorage.setItem(probe, "1");
        g.localStorage.removeItem(probe);
        backend = g.localStorage;
      }
    } catch (e) {
      backend = null;
    }
    return new CaseStore(backend);
  }

  // lib/calendar.ts
  function icsEscape(value) {
    return String(value).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  }
  function foldLine(line) {
    if (line.length <= 75) return line;
    const parts = [line.slice(0, 75)];
    let rest = line.slice(75);
    while (rest.length > 74) {
      parts.push(" " + rest.slice(0, 74));
      rest = rest.slice(74);
    }
    if (rest) parts.push(" " + rest);
    return parts.join("\r\n");
  }
  var COPY = {
    en: {
      summary: (t) => `Follow up: ${t} \u2014 Compton One`,
      body: (i) => [
        `Case ${i.caseId}.`,
        `Check whether anything has happened on the ${i.title.toLowerCase()} you reported.`,
        `Who handles it: ${i.owner}.`,
        `Contact: ${i.contact}.`,
        i.confirmation ? `Your confirmation: ${i.confirmation}.` : "Have your confirmation number ready.",
        "",
        "This is a reminder you set for yourself. It is not a commitment from the City of Compton, and the City has not published a response time for this service."
      ].filter((l) => l !== void 0).join("\n")
    },
    es: {
      summary: (t) => `Seguimiento: ${t} \u2014 Compton One`,
      body: (i) => [
        `Caso ${i.caseId}.`,
        `Revise si ha pasado algo con el reporte de ${i.title.toLowerCase()}.`,
        `Qui\xE9n se encarga: ${i.owner}.`,
        `Contacto: ${i.contact}.`,
        i.confirmation ? `Su confirmaci\xF3n: ${i.confirmation}.` : "Tenga a la mano su n\xFAmero de confirmaci\xF3n.",
        "",
        "Este es un recordatorio que usted mismo puso. No es un compromiso de la Ciudad de Compton, y la Ciudad no ha publicado un tiempo de respuesta para este servicio."
      ].filter((l) => l !== void 0).join("\n")
    }
  };
  function stamp(d) {
    return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }
  function buildReminderIcs(input) {
    var _a;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.followUpDate)) {
      throw new Error("followUpDate must be YYYY-MM-DD");
    }
    const copy = COPY[input.lang];
    const day = input.followUpDate.replace(/-/g, "");
    const end = /* @__PURE__ */ new Date(input.followUpDate + "T00:00:00Z");
    end.setUTCDate(end.getUTCDate() + 1);
    const dayEnd = end.toISOString().slice(0, 10).replace(/-/g, "");
    const now = (_a = input.now) != null ? _a : /* @__PURE__ */ new Date();
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//COMPTON ONE FIX//Resident follow-up//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${icsEscape(input.caseId)}@compton-one.local`,
      `DTSTAMP:${stamp(now)}`,
      `DTSTART;VALUE=DATE:${day}`,
      `DTEND;VALUE=DATE:${dayEnd}`,
      `SUMMARY:${icsEscape(copy.summary(input.title))}`,
      `DESCRIPTION:${icsEscape(copy.body(input))}`,
      "TRANSP:TRANSPARENT",
      "BEGIN:VALARM",
      "TRIGGER:PT9H",
      "ACTION:DISPLAY",
      `DESCRIPTION:${icsEscape(copy.summary(input.title))}`,
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR"
    ];
    return lines.map(foldLine).join("\r\n") + "\r\n";
  }
  function reminderFilename(caseId) {
    return `compton-one-${String(caseId).replace(/[^A-Za-z0-9-]/g, "")}.ics`;
  }

  // entry.ts
  globalThis.C1 = { classifyResidentText, resolveRoute, buildReceipt, sanitizeResidentText, STATUS_SEQUENCE, serviceCatalog, SERVICE_IDS, EMERGENCY_GUIDANCE, analytics, lengthBucket, confidenceBand, ANALYTICS_EVENTS, createCaseStore, buildReminderIcs, reminderFilename };
})();
