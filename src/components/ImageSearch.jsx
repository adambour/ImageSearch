import React, { useState } from 'react';
import axios from 'axios';
import { Instagram, X } from 'lucide-react'

const ImageSearch = () => {
    const [query, setQuery] = useState('');
    const [images, setImages] = useState([]);
    const [imageInfo, setImageInfo] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [displayModal, setDisplayModal] = useState(false);

    const API_KEY = 'crG78G9YqECq4-QvkTTqmjt_T_nerRfWQbazbMs1Thk';

    const fetchImages = async (reset = false) => {
        try {
            setError(null);
            const currentPage = reset ? 1 : page;
            const response = await axios.get('https://api.unsplash.com/search/photos', {
                params: { query, page: currentPage, per_page: 12 },
                headers: { Authorization: `Client-ID ${API_KEY}` },
            });

            setImages((prevImages) => (reset ? response.data.results : [...prevImages, ...response.data.results]));
            setPage(currentPage + 1);
        } catch (err) {
            setError("Une erreur s'est produite. Vérifiez votre clé API.");
        }
    };

    const handleDownload = async (url, filename) => {
        try {
            const response = await axios.get(url, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: response.headers['content-type'] });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();

            URL.revokeObjectURL(link.href);
        } catch (err) {
            console.error('Erreur lors du téléchargement:', err);
        }
    };

    if (displayModal) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = 'auto'
    }


    console.log(imageInfo)

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center ">
            {/* Titre principal */}
            <h1 className="text-4xl pt-10 font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                Recherche d'Images HD
            </h1>

            {/* modal informations */}
            <div
                className={`${displayModal ? "block" : "hidden"
                    } fixed inset-0 z-50 px-4 py-4 backdrop-blur-md bg-black/60 flex justify-center items-center`}
            >
                {/* Bouton de fermeture */}
                <div className="absolute top-4 right-4 cursor-pointer text-white">
                    <div
                        onClick={() => setDisplayModal(false)}
                        className="p-2 rounded-full hover:bg-gray-700 duration-300"
                    >
                        <X size={30} />
                    </div>
                </div>

                {/* Contenu de la modal */}
                <div className="relative bg-gray-800 text-white max-w-4xl w-full rounded-2xl shadow-2xl p-6 md:p-10">
                    {/* Contenu principal */}
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Image principale */}
                        <div className="w-full md:w-1/2">
                            <img
                                src={imageInfo?.urls?.small}
                                alt="Image détaillée"
                                className="rounded-xl w-full"
                            />
                        </div>

                        {/* Informations sur l'image */}
                        <div className="w-full md:w-1/2">
                            <h1 className="text-2xl md:text-3xl font-bold mb-4">
                                Description :{" "}
                                <span className="text-blue-400">
                                    {imageInfo?.alt_description || "Aucune description disponible"}
                                </span>
                            </h1>

                            {/* Informations utilisateur */}
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Utilisateur :</h2>
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className="border-2 border-white rounded-full overflow-hidden w-12 h-12">
                                        <img
                                            src={imageInfo?.user?.profile_image?.small}
                                            alt="Avatar utilisateur"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Détails utilisateur */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">
                                            {imageInfo?.user?.name || "Anonyme"}
                                        </h3>
                                        <p className="text-gray-300 text-sm">
                                            {imageInfo?.user?.bio || "Pas de bio disponible"}
                                        </p>
                                    </div>

                                    {/* Lien Instagram */}
                                    {imageInfo?.user?.instagram_username && (
                                        <a
                                            href={`https://www.instagram.com/${imageInfo.user.instagram_username}/`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-400"
                                        >
                                            <Instagram size={24} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Bouton Télécharger */}
                            <button
                                className="bg-emerald-600 hover:bg-emerald-500 duration-300 w-full py-3 rounded-lg font-semibold mt-6"
                                onClick={() =>
                                    handleDownload(imageInfo?.urls?.full, `${imageInfo?.id}.jpg`)
                                }
                            >
                                Télécharger
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Barre de recherche */}
            <form
                className="flex w-full max-w-lg gap-4 mb-8"
                onSubmit={(e) => {
                    e.preventDefault();
                    fetchImages(true);
                }}
            >
                <input
                    type="text"
                    placeholder="Rechercher des images..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-500 px-6 py-3 text-white rounded-lg shadow-md hover:bg-blue-600 transform hover:scale-105 transition-transform"
                >
                    Rechercher
                </button>
            </form>

            {/* Affichage des erreurs */}
            {error && (
                <p className="text-red-400 mb-4 text-lg font-semibold">{error}</p>
            )}

            {/* Grille d'images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {images.map((image) => (
                    <div onClick={() => { setDisplayModal(true); setImageInfo(image) }} key={image.id} className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                        {/* Image */}
                        <img
                            src={image.urls.small}
                            alt={image.alt_description}
                            className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                ))}
            </div>

            {/* Bouton Load More */}
            {images.length > 0 && (
                <button
                    onClick={() => fetchImages()}
                    className="mt-10 bg-green-500 px-8 py-4 text-white rounded-lg font-bold shadow-md hover:bg-green-600 transform hover:scale-105 transition-transform"
                >
                    Charger plus d'images
                </button>
            )}

            {/* Pied de page */}
            <footer className="mt-12 text-gray-400 text-sm">
                Créé avec <span className="text-red-500">❤</span> et Unsplash API.
            </footer>
        </div>
    );
};

export default ImageSearch;
