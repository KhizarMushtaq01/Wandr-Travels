// frontend/src/pages/DestinationDetail.jsx
import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FaCalendarDays, FaStar, FaBullseye, FaUtensils, FaPlane, FaHotel } from 'react-icons/fa6'

const DESTINATIONS_DATA = {
  'Santorini': {
    name: 'Santorini',
    country: 'Greece',
    fullDescription: 'Santorini is a Cycladic island in the Aegean Sea, known for its dramatic cliffs, white-washed buildings with blue domes, and stunning sunsets. The island was formed by a massive volcanic eruption thousands of years ago, creating its unique crescent shape and caldera views.',
    bestTime: 'April to October',
    topAttractions: [
      'Oia Village - Famous for sunset views',
      'Fira - The capital with stunning caldera views',
      'Red Beach - Unique red volcanic sand',
      'Ancient Thera - Archaeological site',
      'Wine tasting at local vineyards'
    ],
    activities: ['Sunset sailing', 'Volcano hiking', 'Wine tasting', 'Swimming in hot springs'],
    cuisine: 'Fresh seafood, fava (split pea puree), tomato keftedes, and Assyrtiko wine',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80'
  },
  'Kyoto': {
    name: 'Kyoto',
    country: 'Japan',
    fullDescription: 'Kyoto, once the capital of Japan, is a city on the island of Honshu. Famous for its classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and traditional wooden houses. It\'s also known for formal traditions such as kaiseki dining and geisha entertainment.',
    bestTime: 'March-May (cherry blossoms) or October-November (fall colors)',
    topAttractions: [
      'Fushimi Inari Shrine - Thousands of red torii gates',
      'Kinkaku-ji (Golden Pavilion)',
      'Arashiyama Bamboo Grove',
      'Gion District - Geisha culture',
      'Kiyomizu-dera Temple'
    ],
    activities: ['Tea ceremony', 'Kimono wearing', 'Zen meditation', 'Traditional cooking class'],
    cuisine: 'Kaiseki ryori (multi-course meal), matcha desserts, yudofu (tofu hot pot)',
    imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=80'
  },
  'Patagonia': {
    name: 'Patagonia',
    country: 'Argentina & Chile',
    fullDescription: 'Patagonia is a sparsely populated region at the southern end of South America, shared by Argentina and Chile. It features the Andes mountains, glaciers, fjords, and lakes. It\'s a paradise for hikers and nature lovers.',
    bestTime: 'November to March (Southern Hemisphere summer)',
    topAttractions: [
      'Torres del Paine National Park',
      'Perito Moreno Glacier',
      'Los Glaciares National Park',
      'Fitz Roy Mountain',
      'Magdalena Island Penguin Colony'
    ],
    activities: ['Glacier trekking', 'Mountain climbing', 'Kayaking', 'Wildlife watching'],
    cuisine: 'Lamb asado, king crab, calafate berry desserts, Patagonian wine',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80'
  },
  'Maldives': {
    name: 'Maldives',
    country: 'Maldives',
    fullDescription: 'The Maldives is a tropical nation in the Indian Ocean composed of 26 ring-shaped atolls made up of more than 1,000 coral islands. It\'s known for its beaches, blue lagoons, and extensive reefs, making it a premier destination for honeymooners and divers.',
    bestTime: 'November to April',
    topAttractions: [
      'Male City - Capital with local markets',
      'Maafushi Island - Local island experience',
      'Banana Reef - Famous diving spot',
      'Biyadhoo Island - Snorkeling paradise',
      'Artificial Beach - Man-made beach in Male'
    ],
    activities: ['Scuba diving', 'Snorkeling', 'Sunset cruises', 'Fishing trips', 'Spa treatments'],
    cuisine: 'Fresh seafood, mas huni (tuna salad), hedhikaa (short eats), coconut-based curries',
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80'
  },
  'Marrakech': {
    name: 'Marrakech',
    country: 'Morocco',
    fullDescription: 'Marrakech, a former imperial city in western Morocco, is a vibrant and colorful destination. It\'s divided into the old city (medina) and the modern city (Gueliz). The medina is a UNESCO World Heritage site with bustling souks, palaces, and the famous Jemaa el-Fnaa square.',
    bestTime: 'March to May and September to November',
    topAttractions: [
      'Jemaa el-Fnaa Square - Night market and entertainment',
      'Koutoubia Mosque - Largest mosque in Marrakech',
      'Bahia Palace - 19th-century palace',
      'Majorelle Garden - Botanical garden',
      'Saadian Tombs - Historical royal tombs'
    ],
    activities: ['Shopping in souks', 'Hammam spa experience', 'Camel riding', 'Cooking classes'],
    cuisine: 'Tagine, couscous, pastilla, mint tea, and Moroccan pastries',
    imageUrl: 'https://images.unsplash.com/photo-1517821362941-f7f753200fef?w=800&q=80'
  },
  'Iceland': {
    name: 'Iceland',
    country: 'Iceland',
    fullDescription: 'Iceland, a Nordic island nation, is defined by its dramatic landscape with volcanoes, geysers, hot springs, and lava fields. Known as the "Land of Fire and Ice," it offers unique natural wonders and the chance to see the Northern Lights.',
    bestTime: 'June-August (midnight sun) or September-March (Northern Lights)',
    topAttractions: [
      'Golden Circle (Gullfoss, Geysir, Thingvellir)',
      'Blue Lagoon - Geothermal spa',
      'Jökulsárlón Glacier Lagoon',
      'Reynisfjara Black Sand Beach',
      'Seljalandsfoss and Skógafoss Waterfalls'
    ],
    activities: ['Northern Lights hunting', 'Glacier hiking', 'Whale watching', 'Ice caving', 'Hot spring bathing'],
    cuisine: 'Icelandic lamb, skyr (dairy product), fresh seafood, hot dogs (pylsur)',
    imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=80'
  }
}

export default function DestinationDetail() {
  const { name } = useParams()
  const navigate = useNavigate()
  const destination = DESTINATIONS_DATA[name]

  if (!destination) {
    return (
      <div className="min-h-screen bg-w-dark flex items-center justify-center">
        <div className="text-center py-20">
          <h2 className="text-3xl text-white mb-4">Destination Not Found</h2>
          <p className="text-w-muted mb-8">The destination you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="btn-primary">Back to Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-w-dark">
      {/* Simple Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-w-dark/95 backdrop-blur-xl border-b border-w-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-w-accent to-w-gold flex items-center justify-center text-w-dark font-display font-bold text-sm shadow-[0_0_20px_rgba(232,194,122,0.4)]">
              W
            </div>
            <span className="font-display text-xl font-medium text-white tracking-widest">WANDR</span>
          </Link>
          <Link to="/" className="text-sm text-w-muted hover:text-white transition-colors px-4 py-2">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Hero Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden mb-10">
            <img 
              src={destination.imageUrl} 
              alt={destination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-w-dark via-w-dark/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="font-display text-5xl md:text-6xl text-white font-light mb-2">
                {destination.name}
              </h1>
              <p className="text-w-accent text-lg">{destination.country}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* About Section */}
              <section>
                <h2 className="font-display text-2xl text-white mb-4">About {destination.name}</h2>
                <p className="text-w-muted leading-relaxed">{destination.fullDescription}</p>
              </section>

              {/* Best Time to Visit */}
              <section>
                <h2 className="font-display text-2xl text-white mb-4">Best Time to Visit</h2>
                <div className="bg-w-accent/10 border border-w-accent/20 rounded-xl p-4">
                  <p className="text-w-text">
                    <span className="text-w-accent font-semibold inline-flex items-center gap-1"><FaCalendarDays className="w-4 h-4" /> Recommended:</span> {destination.bestTime}
                  </p>
                </div>
              </section>

              {/* Top Attractions */}
              <section>
                <h2 className="font-display text-2xl text-white mb-4 inline-flex items-center gap-2"><FaStar className="w-5 h-5 text-w-accent" /> Top Attractions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {destination.topAttractions.map((attraction, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-w-blue/20 border border-w-border">
                      <FaStar className="text-w-accent w-4 h-4 flex-shrink-0" />
                      <span className="text-w-text">{attraction}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Activities */}
              <section>
                <h2 className="font-display text-2xl text-white mb-4 inline-flex items-center gap-2"><FaBullseye className="w-5 h-5 text-w-accent" /> Popular Activities</h2>
                <div className="flex flex-wrap gap-2">
                  {destination.activities.map((activity, idx) => (
                    <span key={idx} className="bg-w-accent/10 border border-w-accent/20 text-w-accent text-sm px-4 py-2 rounded-full">
                      {activity}
                    </span>
                  ))}
                </div>
              </section>

              {/* Local Cuisine */}
              <section>
                <h2 className="font-display text-2xl text-white mb-4 inline-flex items-center gap-2"><FaUtensils className="w-5 h-5 text-w-accent" /> Local Cuisine</h2>
                <p className="text-w-muted leading-relaxed">{destination.cuisine}</p>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="bg-w-blue/20 border border-w-border rounded-xl p-6  top-24">
                <h3 className="text-white font-semibold text-lg mb-4">Plan Your Trip</h3>
                <div className="space-y-4">
                  <button className="bg-w-accent text-w-dark font-semibold py-3 px-4 rounded-xl hover:bg-w-gold transition-colors w-full inline-flex items-center justify-center gap-2">
                    <FaPlane className="w-4 h-4" /> Book Flights
                  </button>
                  <button className="border border-w-border text-w-text py-3 px-4 rounded-xl hover:border-w-accent hover:text-w-accent transition-colors w-full inline-flex items-center justify-center gap-2">
                    <FaHotel className="w-4 h-4" /> Find Hotels
                  </button>
                  <button className="border border-w-border text-w-text py-3 px-4 rounded-xl hover:border-w-accent hover:text-w-accent transition-colors w-full inline-flex items-center justify-center gap-2">
                    <FaCalendarDays className="w-4 h-4" /> Create Itinerary
                  </button>
                </div>
                <div className="mt-6 pt-6 border-t border-w-border">
                  <Link to="/register" className="text-w-accent hover:text-w-gold text-sm flex items-center justify-center gap-2">
                    Start planning your {destination.name} adventure →
                  </Link>
                </div>
              </div>

              {/* Similar Destinations */}
              <div className="bg-w-blue/20 border border-w-border rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Similar Destinations</h3>
                <div className="space-y-3">
                  {Object.keys(DESTINATIONS_DATA)
                    .filter(d => d !== destination.name)
                    .slice(0, 3)
                    .map(dest => (
                      <Link 
                        key={dest} 
                        to={`/destination/${dest}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-w-blue/40 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <img 
                            src={DESTINATIONS_DATA[dest].imageUrl} 
                            alt={dest}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">{dest}</div>
                          <div className="text-w-muted text-xs">{DESTINATIONS_DATA[dest].country}</div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-w-border/40 bg-w-navy/40 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-w-accent to-w-gold flex items-center justify-center text-w-dark font-bold text-xs">
                W
              </div>
              <span className="font-display text-sm text-white tracking-widest">WANDR</span>
            </div>
            <p className="text-xs text-w-muted/60">
              © {new Date().getFullYear()} Wandr Travel Technologies. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}