import React, { useState } from 'react';
import axios from 'axios';

const ImageSearch = () => {
    const [query, setQuery] = useState('');
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center p-6">
            {/* Titre principal */}
            <h1 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                Recherche d'Images HD
            </h1>

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
                    <div key={image.id} className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                        {/* Image */}
                        <img
                            src={image.urls.small}
                            alt={image.alt_description}
                            className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />

                        {/* Bouton de téléchargement direct */}
                        <button
                            onClick={() => handleDownload(image.urls.full, `${image.id}.jpg`)}
                            className="absolute bottom-4 right-4 bg-green-500 text-white text-sm px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            Télécharger
                        </button>
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
