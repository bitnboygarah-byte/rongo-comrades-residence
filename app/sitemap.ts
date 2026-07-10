import { MetadataRoute } from 'next';

interface Room {
  id: string | number;
  updated_at?: string; 
}

export default async function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rongo-stay.vercel.app';

  let dynamicRooms: MetadataRoute.Sitemap = [];
  try {
    // Fetches your room items from your database route
    const res = await fetch(`${baseUrl}/api/rooms`, { cache: 'no-store' });
    const rooms: Room[] = await res.json();

    if (Array.isArray(rooms)) {
      dynamicRooms = rooms.map((room) => ({
        // Matches your folder pattern: app/hostel/[id]/page.tsx
        url: `${baseUrl}/hostel/${room.id}`, 
        lastModified: room.updated_at ? new Date(room.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch rooms for sitemap:", error);
  }

  return [
    {
      url: baseUrl, // Homepage
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...dynamicRooms, // Dynamic hostel rooms list
  ];
}