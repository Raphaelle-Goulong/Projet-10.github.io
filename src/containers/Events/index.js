import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

// Nombre d'événements par page
const PER_PAGE = 9;

const EventList = () => {
  // Récupération des données et de l'erreur depuis le contexte
  const { data, error } = useData();
  
  // États locaux pour le type d'événement sélectionné et la page actuelle
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrage des événements en fonction du type sélectionné et de la pagination
  const filteredEvents = ((!type ? data?.events : data?.events.filter((e) => e.type === type)) || [])
    .filter((event, index) => {
      // Vérification si l'événement est dans la plage de la page actuelle
      if (
        (currentPage - 1) * PER_PAGE <= index &&
        PER_PAGE * currentPage > index
      ) {
        return true;
      }
      return false;
    });

  // Fonction pour changer le type d'événement et réinitialiser la page courante
  const changeType = (evtType) => {
    console.log("test", evtType); // Debug
    setCurrentPage(1); // Réinitialise la page à 1 lors du changement de type
    setType(evtType); // Met à jour le type d'événement sélectionné
  };

  // Calcul du nombre total de pages
  const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;

  // Création d'une liste des types d'événements uniques
  const typeList = new Set(data?.events.map((event) => event.type));
  
  return (
    <>
      {error && <div>An error occurred</div>} {/* Affichage d'un message d'erreur si nécessaire */}
      {data === null ? (
        "loading" // Affichage d'un message de chargement si les données sont nulles
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)} // Conversion de l'ensemble en tableau pour le sélecteur
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {/* Affichage des cartes d'événements dans un modal */}
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)} // Ouvre le modal au clic
                    imageSrc={event.cover} // Image de couverture de l'événement
                    title={event.title} // Titre de l'événement
                    date={new Date(event.date)} // Date de l'événement
                    label={event.type} // Type d'événement
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {/* Génération des liens de pagination */}
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
