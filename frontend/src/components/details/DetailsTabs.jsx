import { Train, Car, Ship, MessageSquare, ChevronRight } from "lucide-react";
import { getImageUrl } from "../../services/images";
import { useTranslate } from "../../i18n/useTranslate";

const parseItinerary = (itineraryStr, destination, t) => {
  let itineraryTitle = t(`Découvrez ${destination?.name || ""}`);
  let itineraryDesc = t(destination?.description || "");
  let stops = [];

  if (itineraryStr) {
    const trimmed = itineraryStr.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const parsed = JSON.parse(trimmed);
        itineraryTitle = t(parsed.title || itineraryTitle);
        itineraryDesc = t(parsed.description || itineraryDesc);
        stops = parsed.stops || [];
        return { title: itineraryTitle, description: itineraryDesc, stops };
      } catch (e) {
        console.error("Failed to parse itinerary JSON object", e);
      }
    } else if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        stops = JSON.parse(trimmed);
        return { title: itineraryTitle, description: itineraryDesc, stops };
      } catch (e) {
        console.error("Failed to parse itinerary JSON array", e);
      }
    }

    // Fallback to legacy parser:
    const lines = trimmed.split("\n").filter((p) => p.trim() !== "");
    let startIndex = 0;

    const isStopPattern = (str) => {
      return /^(Jour\s+\d+|Étape\s+\d+|Stop\s+\d+|[A-Za-zÀ-ÿ\s-]+[:-]\s*[A-Za-zÀ-ÿ\s-]+)/i.test(
        str.trim(),
      );
    };

    if (lines.length > 0 && !isStopPattern(lines[0])) {
      itineraryTitle = t(lines[0].trim());
      startIndex = 1;
      if (lines.length > 1 && !isStopPattern(lines[1])) {
        itineraryDesc = t(lines[1].trim());
        startIndex = 2;
      }
    }

    const stopLines = lines.slice(startIndex);
    const fallbackImages = [
      "/image/about_hero.png",
      "/image/mountain.png",
      "/image/madagascar_river_boat.png",
      "/image/beach_sunset_hero.png",
    ];

    stops = stopLines.map((p, idx) => {
      let title = `${t("Étape")} ${idx + 1}`;
      let desc = p;
      let incontournable = t(
        "Découverte des plus beaux secrets et panoramas de cette étape phare du circuit.",
      );
      const matchTitle = p.match(/^(Jour\s+\d+|[A-Za-zÀ-ÿ\s-]+)\s*[:-]/i);
      if (matchTitle) {
        title = t(matchTitle[1].trim());
        desc = p.substring(matchTitle[0].length).trim();
      }
      const isLast = idx === stopLines.length - 1;
      return {
        name: title,
        role: idx === 0 ? t("Départ") : isLast ? t("Arrivée") : t("Escale"),
        description: desc,
        incontournable: incontournable,
        image: fallbackImages[idx % fallbackImages.length],
        transit: !isLast
          ? `${t("Transfert Local ➔ Étape")} ${idx + 2} - ~ 3h`
          : "",
        transitType: "car",
      };
    });
  }

  return { title: itineraryTitle, description: itineraryDesc, stops };
};

const DetailsTabs = ({
  activeTab,
  setActiveTab,
  isMobile,
  destination,
  activeDeparture,
  activeOption,
}) => {
  const { t } = useTranslate();
  const tabs = [
    { label: t("ITINÉRAIRE"), key: "itineraire" },
    { label: t("HÉBERGEMENT"), key: "hebergement" },
    { label: t("BUDGET"), key: "budget" },
    { label: t("NOS CONSEILS"), key: "conseils" },
  ];

  return (
    <div
      className="content-left"
      style={{ width: "100%", fontFamily: '"Outfit", sans-serif' }}
    >
      {/* Tabs Header */}
      <div
        className="tabs-header"
        style={{
          display: "flex",
          borderBottom: "2.5px solid #e2e8f0",
          marginBottom: "32px",
          overflowX: "auto",
          backgroundColor: "transparent",
          scrollbarWidth: "none",
          gap: "24px",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "16px 8px",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "1px",
              border: "none",
              backgroundColor: "transparent",
              color: activeTab === tab.key ? "#2D4A43" : "#718096",
              borderBottom:
                activeTab === tab.key
                  ? "4px solid #2D4A43"
                  : "4px solid transparent",
              whiteSpace: "nowrap",
              cursor: "pointer",
              transition: "all 0.2s",
              marginBottom: "-2.5px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="tab-content" style={{ padding: "12px 0", width: "100%" }}>
        {activeTab === "itineraire" && (
          <ItineraryTab
            isMobile={isMobile}
            destination={destination}
            activeDeparture={activeDeparture}
            activeOption={activeOption}
          />
        )}
        {activeTab === "hebergement" && (
          <AccommodationTab destination={destination} />
        )}
        {activeTab === "budget" && <BudgetTab destination={destination} />}
        {activeTab === "conseils" && <TipsTab destination={destination} />}
      </div>
    </div>
  );
};

// Sub-tab components
const ItineraryTab = ({
  isMobile,
  destination,
  activeDeparture,
  activeOption,
}) => {
  const { t } = useTranslate();
  const nameLower = (destination.name || "").toLowerCase();

  const sudStops = [
    {
      name: t("Antananarivo"),
      role: t("Départ"),
      description: t(
        "Antananarivo, la ville des Mille, est la capitale pittoresque de Madagascar. Bâtie sur des collines sauvages, elle offre des panoramas saisissants et une richesse historique unique.",
      ),
      incontournable: t(
        "Le Palais de la Reine (Rova). C'est la majestueuse citadelle qui surplombe la capitale, témoignant de l'histoire royale de Madagascar.",
      ),
      image: "/image/about_hero.png",
      transit: t("Véhicule Privé Antananarivo ➔ Antsirabe - 4h"),
      transitAvis: 1,
      transitType: "car",
    },
    {
      name: t("Antsirabe"),
      role: t("Escale"),
      description: t(
        "Antsirabe est célèbre pour ses sources thermales et ses pousse-pousses colorés. Située sur les hautes terres, cette ville paisible charme par son architecture coloniale et ses ateliers d'artisans locaux.",
      ),
      incontournable: t(
        "Les lacs de cratère Tritriva et Andraikiba, mystérieux joyaux naturels entourés de légendes locales.",
      ),
      image: "/image/mountain.png",
      transit: t("Véhicule Privé Antsirabe ➔ Ranomafana - 5h"),
      transitAvis: 3,
      transitType: "car",
    },
    {
      name: t("Ranomafana"),
      role: t("Escale"),
      description: t(
        "Ranomafana abrite l'un des parcs nationaux de forêt tropicale humide les plus spectaculaires au monde. Un paradis de biodiversité regorgeant de faune endémique, cascades et flore tropicale.",
      ),
      incontournable: t(
        "Les lémuriens dorés (Hapalémur doré), une espèce rare et unique qui s'épanouit au cœur de cette jungle luxuriante.",
      ),
      image: "/image/madagascar_river_boat.png",
      transit: t("Véhicule Privé Ranomafana ➔ Ranohira - 6h"),
      transitAvis: 2,
      transitType: "car",
    },
    {
      name: t("Isalo - Ranohira"),
      role: t("Arrivée"),
      description: t(
        "Isalo est un immense massif de grès jurassique sculpté par l'érosion. Des canyons profonds, des piscines naturelles et des oasis verdoyantes au milieu d'un décor de Far West spectaculaire.",
      ),
      incontournable: t(
        "La piscine naturelle de l'Isalo, une oasis paradisiaque aux eaux cristallines cachée au fond d'un canyon de grès.",
      ),
      image: "/image/isalo_destination.png",
    },
  ];

  const nosyBeStops = [
    {
      name: t("Hell-Ville"),
      role: t("Départ"),
      description: t(
        "Capitale coloniale animée de Nosy Be, Hell-Ville offre des marchés parfumés aux épices, à la vanille et à l'ylang-ylang, ainsi qu'un port pittoresque ouvert sur le canal du Mozambique.",
      ),
      incontournable: t(
        "Le marché couvert d'Hell-Ville. C'est l'endroit parfait pour respirer les parfums de l'île et découvrir la vie locale.",
      ),
      image: "/image/popular_resort.png",
      transit: t("Bateau Rapide Hell-Ville ➔ Nosy Komba - 30min"),
      transitAvis: 1,
      transitType: "ship",
    },
    {
      name: t("Nosy Komba"),
      role: t("Escale"),
      description: t(
        "L'île aux lémuriens par excellence. Cette montagne volcanique recouverte d'une forêt dense abrite de nombreuses familles de lémuriens Macaco extrêmement amicaux et habitués à l'homme.",
      ),
      incontournable: t(
        "Le parc aux lémuriens de Nosy Komba. Observez ces primates agiles de près dans leur habitat naturel protégé.",
      ),
      image: "/image/madagascar_river_boat.png",
      transit: t("Bateau Rapide Nosy Komba ➔ Nosy Tanikely - 20min"),
      transitAvis: 2,
      transitType: "ship",
    },
    {
      name: t("Nosy Tanikely"),
      role: t("Escale"),
      description: t(
        "Réserve sous-marine nationale et véritable aquarium naturel. Nosy Tanikely offre des récifs coralliens d'une richesse exceptionnelle, parfaits pour la plongée libre et l'observation marine.",
      ),
      incontournable: t(
        "Nager avec les tortues marines géantes qui habitent les eaux turquoises et translucides de cette aire marine protégée.",
      ),
      image: "/image/beach_sunset_hero.png",
      transit: t("Bateau Rapide Nosy Tanikely ➔ Nosy Iranja - 1h30"),
      transitAvis: 4,
      transitType: "ship",
    },
    {
      name: t("Nosy Iranja"),
      role: t("Arrivée"),
      description: t(
        "Élue parmi les plus belles îles du monde, Nosy Iranja se compose de deux îlots reliés par une bande de sable blanc immaculé de 2 km, recouverte à marée haute. Un paradis absolu.",
      ),
      incontournable: t(
        "Marcher sur la langue de sable blanc reliant les deux îles au coucher de soleil, une expérience inoubliable.",
      ),
      image: "/image/villa.png",
    },
  ];

  const sainteMarieStops = [
    {
      name: t("Ambodifotatra"),
      role: t("Départ"),
      description: t(
        "Ville principale et historique de l'île Sainte-Marie, chargée d'histoire avec son église en pierre (la plus ancienne de Madagascar) et sa magnifique baie abritée.",
      ),
      incontournable: t(
        "Le cimetière des pirates de Sainte-Marie, situé sur une presqu'île romantique, témoignant du passé légendaire de l'île.",
      ),
      image: "/image/beach_sunset_hero.png",
      transit: t(
        "Pirogue traditionnelle Ambodifotatra ➔ Île aux Nattes - 15min",
      ),
      transitAvis: 2,
      transitType: "ship",
    },
    {
      name: t("Île aux Nattes"),
      role: t("Arrivée"),
      description: t(
        "Un petit paradis sans voiture à l'extrême sud de Sainte-Marie. Des plages de sable blanc corallien bordées de cocotiers et un lagon turquoise protégé par une barrière de corail.",
      ),
      incontournable: t(
        "Le phare de l'Île aux Nattes, offrant une vue panoramique époustouflante à 360° sur tout le lagon et Sainte-Marie.",
      ),
      image: "/image/luxury_resort_pool_banner.png",
    },
  ];

  const antananarivoStops = [
    {
      name: t("Haute Ville"),
      role: t("Départ"),
      description: t(
        "Le cœur historique et culturel d'Antananarivo. Ses ruelles pavées sinueuses et ses maisons de style victorien témoignent du glorieux passé impérial malgache.",
      ),
      incontournable: t(
        "Le Rova de Manjakamiadana. Le palais royal restauré offre une vue imprenable sur la capitale à 360°.",
      ),
      image: "/image/about_hero.png",
      transit: t("Véhicule Privé Haute Ville ➔ Parc d'Ambohimanga - 45min"),
      transitAvis: 1,
      transitType: "car",
    },
    {
      name: t("Ambohimanga"),
      role: t("Arrivée"),
      description: t(
        "La colline royale d'Ambohimanga est un site classé au patrimoine mondial de l'UNESCO. Berceau sacré de la dynastie Merina, elle symbolise l'identité culturelle nationale.",
      ),
      incontournable: t(
        "Le Palais d'Andrianampoinimerina, une case en bois de palissandre préservée renfermant des trésors royaux inestimables.",
      ),
      image: "/image/mountain.png",
    },
  ];

  const defaultItalyStops = [
    {
      name: t("Lyon"),
      role: t("Départ"),
      description: `${t("Depuis Lyon, profitez d'une connexion ferroviaire directe et confortable pour commencer votre voyage vers l'Italie en toute sérénité. C'est l'itinéraire idéal choisi pour")} ${t(activeOption)}.`,
      incontournable: t(
        "La gare de Lyon-Part-Dieu, point de départ moderne et connecté qui vous propulse directement vers les Alpes.",
      ),
      image: "/image/hero_new.png",
      transit: t("Train Lyon ➔ Milan - 4h45"),
      transitAvis: 1,
      transitType: "train",
    },
    {
      name: t("Milan"),
      role: t("Escale"),
      description: t(
        "Milan est une étape incontournable si vous allez en Italie en train. Que ce soit pour une escale de quelques heures ou un périple de quelques jours, la ville saura vous charmer. L'équipe Mollow s'y est rendue plusieurs fois, et vous partage ses coups de cœur.",
      ),
      incontournable: t(
        "Le Duomo. C'est la majestueuse cathédrale de Milan, que l'on voit sur toutes les photos, et il est vrai qu'elle est impressionnante. Pour la visiter, on vous conseille de réserver vos billets à l'avance dans la Galleria Vittorio Emanuele II, un élégant centre...",
      ),
      image: "/image/image1.jpeg",
      transit: t("Train Milan ➔ Rome - 3h"),
      transitAvis: 2,
      transitType: "train",
    },
    {
      name: t("Rome"),
      role: t("Arrivée"),
      description: t(
        "Rome, c'est évidemment LA ville incontournable quand on se rend en Italie. Dans la ville de Jules César, la liste des incontournables à voir est longue : le Colisée, le musée du Vatican, la Basilique Saint-Pierre ou encore le Panthéon ! Vous avez sûrement de nombreuses idées sur les pépites à visiter.",
      ),
      incontournable: t(
        "Le Colisée, monument mythique symbole de la grandeur romaine, ainsi que la fontaine de Trevi où jeter votre pièce de retour.",
      ),
      image: "/image/image2.jpeg",
    },
  ];

  const parsed = parseItinerary(destination.itinerary, destination, t);
  let stops = parsed.stops;
  let itineraryTitle = parsed.title;
  let itineraryDesc =
    parsed.description ||
    `${t("Itinéraire sur-mesure proposé pour votre voyage")} ${t(activeDeparture)} (${t(activeOption)}).`;

  if (!stops || stops.length === 0) {
    if (
      nameLower.includes("sud") ||
      nameLower.includes("tour") ||
      nameLower.includes("cultural") ||
      nameLower.includes("culturel")
    ) {
      stops = sudStops;
    } else if (
      nameLower.includes("nosy") ||
      nameLower.includes("be") ||
      nameLower.includes("détente")
    ) {
      stops = nosyBeStops;
    } else if (nameLower.includes("marie") || nameLower.includes("sainte")) {
      stops = sainteMarieStops;
    } else if (
      nameLower.includes("tana") ||
      nameLower.includes("antananarivo")
    ) {
      stops = antananarivoStops;
    } else {
      stops = defaultItalyStops;
    }
  }

  return (
    <div className="itinerary-tab" style={{ width: "100%" }}>
      {/* Title */}
      <h2
        style={{
          fontSize: "26px",
          color: "#1B3D34",
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 800,
          marginBottom: "8px",
        }}
      >
        {itineraryTitle}
      </h2>
      <p
        style={{
          fontSize: "15px",
          color: "#718096",
          lineHeight: 1.6,
          marginBottom: "32px",
        }}
      >
        {itineraryDesc}
      </p>

      {/* Timeline Wrapper */}
      <div
        style={{
          position: "relative",
          marginTop: "20px",
          paddingLeft: isMobile ? "12px" : "0",
        }}
      >
        {/* Vertical Timeline Line */}
        {!isMobile && (
          <div
            style={{
              position: "absolute",
              left: "160px",
              top: "20px",
              bottom: "60px",
              width: "3px",
              backgroundColor: "#CBD5E0",
              zIndex: 1,
            }}
          ></div>
        )}

        {stops.map((stop, index) => {
          const isLast = index === stops.length - 1;
          const transitIcon =
            stop.transitType === "ship" ? (
              <Ship size={14} />
            ) : stop.transitType === "car" ? (
              <Car size={14} />
            ) : (
              <Train size={14} />
            );

          return (
            <div
              key={index}
              style={{ marginBottom: "40px", position: "relative" }}
            >
              {/* Stop Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "140px 40px 1fr",
                  alignItems: "start",
                  gap: isMobile ? "16px" : "0",
                }}
              >
                {/* Left Side: City & Role */}
                <div
                  style={{
                    textAlign: isMobile ? "left" : "right",
                    paddingRight: isMobile ? "0" : "24px",
                    paddingTop: "8px",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color: "#1B3D34",
                      margin: 0,
                    }}
                  >
                    {t(stop.name)}
                  </h4>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color:
                        stop.role === t("Départ")
                          ? "#2F855A"
                          : stop.role === t("Arrivée")
                            ? "#C21A4B"
                            : "#718096",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {t(stop.role)}
                  </span>
                </div>

                {/* Middle Side: Dot */}
                {!isMobile && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingTop: "12px",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor:
                          stop.role === t("Départ")
                            ? "#2F855A"
                            : stop.role === t("Arrivée")
                              ? "#C21A4B"
                              : "#1B3D34",
                        border: "3px solid #fff",
                        boxShadow: "0 0 0 3px #CBD5E0",
                      }}
                    ></div>
                  </div>
                )}

                {/* Right Side: Stop Card */}
                <div
                  style={{
                    backgroundColor: "#fff",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  className="stop-detail-card"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.05)";
                    const img =
                      e.currentTarget.querySelector(".stop-card-image");
                    if (img) img.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow =
                      "0 4px 20px rgba(0,0,0,0.02)";
                    const img =
                      e.currentTarget.querySelector(".stop-card-image");
                    if (img) img.style.transform = "none";
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "180px 1fr",
                      gap: "24px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        borderRadius: "12px",
                        overflow: "hidden",
                        height: "140px",
                        position: "relative",
                        border: "1px solid #edf2f7",
                      }}
                    >
                      <img
                        className="stop-card-image"
                        src={getImageUrl(stop.image, "/image/hero.png")}
                        alt={t(stop.name)}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.4s ease",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: "140px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#4A5568",
                            lineHeight: 1.6,
                            margin: "0 0 12px 0",
                            textAlign: "justify",
                          }}
                        >
                          {t(stop.description)}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "flex-start",
                            marginTop: "12px",
                          }}
                        >
                          <span
                            style={{
                              color: "#C21A4B",
                              fontWeight: 800,
                              fontSize: "13px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {t("L'incontournable :")}
                          </span>
                          <span
                            style={{
                              fontSize: "13px",
                              color: "#2D3748",
                              fontWeight: 600,
                              lineHeight: 1.5,
                            }}
                          >
                            {t(stop.incontournable)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transit Connector */}
              {!isLast && stop.transit && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "140px 40px 1fr",
                    alignItems: "center",
                    margin: "16px 0",
                  }}
                >
                  <div></div>
                  {!isMobile && <div></div>}
                  <div
                    style={{
                      backgroundColor: "#FFF5F7",
                      border: "1px solid #FED7E2",
                      borderRadius: "12px",
                      padding: "12px 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#9B2C2C",
                      }}
                    >
                      {transitIcon}
                      <span style={{ fontSize: "13px", fontWeight: 800 }}>
                        {t(stop.transit)}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          color: "#718096",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        <MessageSquare size={13} />
                        <span>
                          ({stop.transitAvis} {t("avis")})
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          document
                            .getElementById("formulaire-devis")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        style={{
                          backgroundColor: "#C21A4B",
                          color: "#fff",
                          border: "none",
                          padding: "6px 14px",
                          borderRadius: "8px",
                          fontSize: "11px",
                          fontWeight: 800,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          boxShadow: "0 2px 5px rgba(194,26,75,0.2)",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#9d123c")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#C21A4B")
                        }
                      >
                        {t("Voir les prix")} <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p
        style={{
          fontSize: "13px",
          color: "#718096",
          fontStyle: "italic",
          marginTop: "24px",
        }}
      >
        {t(
          "* Cet itinéraire est indicatif. Tous nos circuits sont 100% personnalisables et adaptables selon vos envies avec nos conseillers spécialistes.",
        )}
      </p>
    </div>
  );
};

const AccommodationTab = ({ destination }) => {
  const { t } = useTranslate();
  return (
    <div className="accommodation-tab" style={{ padding: "8px" }}>
      <h2
        style={{
          fontSize: "24px",
          color: "#1B3D34",
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 800,
          marginBottom: "16px",
        }}
      >
        {t("Vos hébergements pour")} {t(destination.name)}
      </h2>
      <div
        style={{
          fontSize: "15px",
          color: "#4A5568",
          lineHeight: 1.7,
          marginBottom: "32px",
          textAlign: "justify",
          whiteSpace: "pre-wrap",
        }}
      >
        {t(destination.accommodation) ||
          t(
            "Nous sélectionnons pour vous les meilleurs établissements alliant confort, authenticité et respect de l'environnement. Chaque étape de votre circuit a été pensée pour vous offrir une expérience immersive de qualité.",
          )}
      </div>
    </div>
  );
};

const BudgetTab = ({ destination }) => {
  const { t } = useTranslate();
  return (
    <div className="budget-tab" style={{ padding: "8px" }}>
      <h2
        style={{
          fontSize: "24px",
          color: "#1B3D34",
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 800,
          marginBottom: "16px",
        }}
      >
        {t("Détails du Budget")}
      </h2>
      <div
        style={{
          fontSize: "15px",
          color: "#4A5568",
          lineHeight: 1.7,
          textAlign: "justify",
          whiteSpace: "pre-wrap",
          marginBottom: "32px",
        }}
      >
        {t(destination.budget) ||
          `${t("À partir de")} ${t(destination.price)}. ${t("Ce tarif inclut généralement l'hébergement, les transports locaux et l'assistance sur place. Pour un devis personnalisé adapté à vos neuromande, n'hésitez pas à nous contacter.")}`}
      </div>
    </div>
  );
};

const TipsTab = ({ destination }) => {
  const { t } = useTranslate();
  return (
    <div className="tips-tab" style={{ padding: "8px" }}>
      <h2
        style={{
          fontSize: "24px",
          color: "#1B3D34",
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 800,
          marginBottom: "16px",
        }}
      >
        {t("Nos conseils pour votre voyage à")} {t(destination.name)}
      </h2>
      <div
        style={{
          fontSize: "15px",
          color: "#4A5568",
          lineHeight: 1.7,
          textAlign: "justify",
          whiteSpace: "pre-wrap",
          marginBottom: "32px",
        }}
      >
        {t(destination.tips) ||
          t(
            "Prévoyez des vêtements légers mais aussi des tenues imperméables selon la saison. N'oubliez pas votre spray anti-moustique, votre crème solaire et votre appareil photo. Respectez les coutumes locales (Fady) et la faune sauvage de l'île.",
          )}
      </div>
    </div>
  );
};

export default DetailsTabs;
