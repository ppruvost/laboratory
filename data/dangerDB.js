export const dangerDB = [

/* =========================
   💥 DANGERS PHYSIQUES
========================= */

{code:"H200", cat:"Physique", text:"Explosif instable"},
{code:"H201", cat:"Physique", text:"Explosif danger d'explosion en masse"},
{code:"H202", cat:"Physique", text:"Explosif danger sérieux de projection"},
{code:"H203", cat:"Physique", text:"Explosif danger d'incendie, souffle ou projection"},
{code:"H204", cat:"Physique", text:"Danger d'incendie ou de projection"},
{code:"H205", cat:"Physique", text:"Danger d'explosion en masse en cas d'incendie"},

{code:"H220", cat:"Physique", text:"Gaz extrêmement inflammable"},
{code:"H221", cat:"Physique", text:"Gaz inflammable"},
{code:"H222", cat:"Physique", text:"Aérosol extrêmement inflammable"},
{code:"H223", cat:"Physique", text:"Aérosol inflammable"},
{code:"H224", cat:"Physique", text:"Liquide et vapeurs extrêmement inflammables"},
{code:"H225", cat:"Physique", text:"Liquide et vapeurs très inflammables"},
{code:"H226", cat:"Physique", text:"Liquide et vapeurs inflammables"},

{code:"H230", cat:"Physique", text:"Peut exploser même sans air"},
{code:"H231", cat:"Physique", text:"Peut exploser même sans air à haute pression"},
{code:"H240", cat:"Physique", text:"Peut exploser en cas de chauffage"},
{code:"H241", cat:"Physique", text:"Peut s'enflammer ou exploser en cas de chauffage"},

{code:"H250", cat:"Physique", text:"S'enflamme spontanément au contact de l'air"},
{code:"H251", cat:"Physique", text:"Peut s'échauffer et s'enflammer"},
{code:"H252", cat:"Physique", text:"Peut s'échauffer en grande quantité"},

{code:"H260", cat:"Physique", text:"Dégage des gaz inflammables au contact de l'eau"},
{code:"H261", cat:"Physique", text:"Dégage des gaz inflammables au contact de l'eau"},
{code:"H272", cat:"Physique", text:"Peut aggraver un incendie ; comburant"},

/* =========================
   ☠️ DANGERS SANTÉ
========================= */

{code:"H300", cat:"Santé", text:"Mortel en cas d'ingestion"},
{code:"H301", cat:"Santé", text:"Toxique en cas d'ingestion"},
{code:"H302", cat:"Santé", text:"Nocif en cas d'ingestion"},

{code:"H310", cat:"Santé", text:"Mortel par contact cutané"},
{code:"H311", cat:"Santé", text:"Toxique par contact cutané"},
{code:"H312", cat:"Santé", text:"Nocif par contact cutané"},

{code:"H314", cat:"Santé", text:"Provoque des brûlures graves de la peau"},
{code:"H315", cat:"Santé", text:"Provoque une irritation cutanée"},

{code:"H317", cat:"Santé", text:"Peut provoquer une allergie cutanée"},
{code:"H318", cat:"Santé", text:"Provoque des lésions oculaires graves"},
{code:"H319", cat:"Santé", text:"Provoque une sévère irritation des yeux"},

{code:"H330", cat:"Santé", text:"Mortel par inhalation"},
{code:"H331", cat:"Santé", text:"Toxique par inhalation"},
{code:"H332", cat:"Santé", text:"Nocif par inhalation"},

{code:"H340", cat:"CMR", text:"Peut induire des anomalies génétiques"},
{code:"H341", cat:"CMR", text:"Susceptible d'induire des anomalies génétiques"},

{code:"H350", cat:"CMR", text:"Peut provoquer le cancer"},
{code:"H351", cat:"CMR", text:"Susceptible de provoquer le cancer"},

{code:"H360", cat:"CMR", text:"Peut nuire à la fertilité ou au fœtus"},
{code:"H361", cat:"CMR", text:"Susceptible de nuire à la fertilité ou au fœtus"},

/* =========================
   🌊 ENVIRONNEMENT
========================= */

{code:"H400", cat:"Environnement", text:"Très toxique pour les organismes aquatiques"},
{code:"H410", cat:"Environnement", text:"Très toxique avec effets durables"},
{code:"H411", cat:"Environnement", text:"Toxique avec effets durables"},
{code:"H412", cat:"Environnement", text:"Nocif pour les organismes aquatiques"},
{code:"H413", cat:"Environnement", text:"Peut être nocif à long terme"},

/* =========================
   🧪 EUH (mentions complémentaires UE)
========================= */

{code:"EUH001", cat:"UE", text:"Explosif à l'état sec"},
{code:"EUH006", cat:"UE", text:"Explosif avec ou sans contact avec l'air"},
{code:"EUH014", cat:"UE", text:"Réagit violemment au contact de l'eau"},
{code:"EUH018", cat:"UE", text:"Peut former un mélange explosif"},

{code:"EUH066", cat:"UE", text:"L'exposition répétée peut provoquer dessèchement de la peau"},
{code:"EUH070", cat:"UE", text:"Toxique par contact oculaire"},
{code:"EUH071", cat:"UE", text:"Corrosif pour les voies respiratoires"},

{code:"EUH208", cat:"UE", text:"Peut produire une réaction allergique"},

{code:"EUH210", cat:"UE", text:"Fiche de données de sécurité disponible sur demande"},

/* =========================
   Prévention
========================= */
{code:"P201", cat:"Prévention", text:"Se procurer les instructions spéciales avant utilisation"},
{code:"P202", cat:"Prévention", text:"Ne pas manipuler avant d’avoir lu et compris toutes les précautions de sécurité"},

{code:"P210", cat:"Prévention", text:"Tenir à l’écart de la chaleur, des surfaces chaudes, des étincelles, des flammes nues et de toute autre source d’inflammation. Ne pas fumer"},

{code:"P221", cat:"Prévention", text:"Prendre toutes précautions pour éviter de mélanger avec des matières combustibles"},
   
{code:"P233", cat:"Prévention", text:"Maintenir le récipient fermé de manière étanche"},

{code:"P240", cat:"Prévention", text:"Mettre à la terre et relier par liaison équipotentielle le récipient et le matériel de réception"},

{code:"P260", cat:"Prévention", text:"Ne pas respirer les poussières/fumées/gaz/brouillards/vapeurs/aérosols"},
{code:"P264", cat:"Prévention", text:"Se laver soigneusement après manipulation"},

{code:"P280", cat:"Prévention", text:"Porter des gants de protection/des vêtements de protection/un équipement de protection des yeux/du visage"},

{code:"P301", cat:"Intervention", text:"EN CAS D’INGESTION :"},

{code:"P303", cat:"Intervention", text:"EN CAS DE CONTACT AVEC LA PEAU (ou les cheveux) :"},

{code:"P310", cat:"Intervention", text:"Appeler immédiatement un CENTRE ANTIPOISON ou un médecin"},

{code:"P313", cat:"Intervention", text:"Consulter un médecin"},

{code:"P330", cat:"Intervention", text:"Rincer la bouche"},

{code:"P331", cat:"Intervention", text:"NE PAS faire vomir"},

{code:"P337", cat:"Intervention", text:"Si l’irritation oculaire persiste :"},

{code:"P353", cat:"Intervention", text:"Rincer la peau à l’eau ou se doucher"},

{code:"P361", cat:"Intervention", text:"Enlever immédiatement tous les vêtements contaminés"},

{code:"P405", cat:"Stockage", text:"Garder sous clef"},

{code:"P501", cat:"Élimination", text:"Éliminer le contenu/récipient conformément à la réglementation locale/régionale/nationale/internationale"},

{code:"P301+P330+P331", cat:"Intervention", text:"EN CAS D’INGESTION : Rincer la bouche. NE PAS faire vomir"},
{code:"P303+P361+P353", cat:"Intervention", text:"EN CAS DE CONTACT AVEC LA PEAU (ou les cheveux) : Enlever immédiatement tous les vêtements contaminés. Rincer la peau à l’eau ou se doucher"},
{code:"P305+P351+P338", cat:"Intervention", text:"EN CAS DE CONTACT AVEC LES YEUX : Rincer avec précaution à l’eau pendant plusieurs minutes. Enlever les lentilles de contact si la victime en porte et si elles peuvent être facilement enlevées. Continuer à rincer"},
{code:"P310+P405+P501", cat:"Intervention/Stockage/Élimination", text:"Appeler immédiatement un CENTRE ANTIPOISON ou un médecin. Garder sous clef. Éliminer le contenu/récipient conformément à la réglementation locale/régionale/nationale/internationale"},
{code:"P337+P313", cat:"Intervention", text:"Si l’irritation oculaire persiste : Consulter un médecin"}

];
