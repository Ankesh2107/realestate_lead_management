// import React from 'react';
// import { Building2, MapPin, RefreshCw } from 'lucide-react';
// import { iconBtnClass, panelClass } from '@/lib/dashboard/styles';
// import { Property } from '@/types/dashboard';

// export function PropertiesTab({
//   properties,
//   loadingProperties,
//   fetchProperties,
// }: {
//   properties: Property[];
//   loadingProperties: boolean;
//   fetchProperties: () => void;
// }) {
//   return (
//     <div className={panelClass}>
//       <div className="mb-4 flex items-center justify-between">
//         <h2 className="text-base font-bold text-ink">Properties Inventory</h2>
//         <button onClick={fetchProperties} className={iconBtnClass}>
//           <RefreshCw size={14} /> Refresh
//         </button>
//       </div>
//       {loadingProperties ? (
//         <p className="text-[13px] text-muted">Loading properties...</p>
//       ) : properties.length === 0 ? (
//         <div className="flex flex-col items-center gap-2.5 py-12 text-faint">
//           <Building2 size={28} />
//           <p className="text-[13px]">No properties listed yet.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
//           {properties.map((p) => (
//             <div key={p.id} className="rounded-2xl border border-border bg-surface-alt p-4">
//               <div className="mb-2 flex items-start justify-between gap-2">
//                 <h3 className="text-[15.5px] font-bold text-ink">{p.title}</h3>
//                 <span className="shrink-0 rounded-[5px] bg-primary-soft px-2 py-0.5 text-[10.5px] font-bold uppercase text-primary">
//                   {p.possession_status || 'Active'}
//                 </span>
//               </div>
//               <p className="mb-3 flex items-center gap-1 text-[13px] text-muted">
//                 <MapPin size={14} /> {p.location}, {p.city}
//               </p>
//               <div className="mb-3 flex justify-between rounded-xl border border-border bg-surface p-2.5 text-[13px] text-ink">
//                 <div>
//                   <span className="block text-[11px] text-faint">Type</span>
//                   <strong>{p.bhk_type} Flat</strong>
//                 </div>
//                 <div>
//                   <span className="block text-[11px] text-faint">Area</span>
//                   <strong>{p.sqft ? `${p.sqft} sqft` : '—'}</strong>
//                 </div>
//                 <div>
//                   <span className="block text-[11px] text-faint">Price</span>
//                   <strong className="text-success">₹{(p.price / 10000000).toFixed(2)} Cr</strong>
//                 </div>
//               </div>
//               {Array.isArray(p.amenities) && p.amenities.length > 0 && (
//                 <div className="flex flex-wrap gap-1.5">
//                   {p.amenities.slice(0, 4).map((a: string, idx: number) => (
//                     <span key={idx} className="rounded-[5px] border border-border bg-surface px-2 py-0.5 text-[11px] text-muted">
//                       {a}
//                     </span>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import React from 'react';
import { Building2, Maximize, MapPin, RefreshCw } from 'lucide-react';
import { iconBtnClass, panelClass } from '@/lib/dashboard/styles';
import { Property } from '@/types/dashboard';

// Curated Unsplash real-estate shots, cycled per card since we don't have real listing photos.
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&q=80',
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
];

export function PropertiesTab({
  properties,
  loadingProperties,
  fetchProperties,
}: {
  properties: Property[];
  loadingProperties: boolean;
  fetchProperties: () => void;
}) {
  return (
    <div className={panelClass}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-ink">Properties Inventory</h2>
          <p className="mt-0.5 text-xs text-faint">{properties.length} listings</p>
        </div>
        <button onClick={fetchProperties} className={iconBtnClass}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      {loadingProperties ? (
        <p className="text-[13px] text-muted">Loading properties...</p>
      ) : properties.length === 0 ? (
        <div className="flex flex-col items-center gap-2.5 py-12 text-faint">
          <Building2 size={28} />
          <p className="text-[13px]">No properties listed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((p, idx) => (
            <div
              key={p.id}
              className="group overflow-hidden rounded-2xl border border-border bg-surface-alt transition-shadow hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute right-3 top-3 rounded-[5px] bg-primary-soft px-2 py-0.5 text-[10.5px] font-bold uppercase text-primary shadow-sm">
                  {p.possession_status || 'Active'}
                </span>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent px-3.5 pb-2.5 pt-6">
                  <p className="text-[17px] font-bold text-white drop-shadow-sm">
                    ₹{(p.price / 10000000).toFixed(2)} Cr
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <h3 className="mb-1 truncate text-[15.5px] font-bold text-ink">{p.title}</h3>
                <p className="mb-3 flex items-center gap-1 text-[13px] text-muted">
                  <MapPin size={14} /> {p.location}, {p.city}
                </p>

                <div className="mb-3 flex justify-between rounded-xl border border-border bg-surface p-2.5 text-[13px] text-ink">
                  <div>
                    <span className="block text-[11px] text-faint">Type</span>
                    <strong>{p.bhk_type} Flat</strong>
                  </div>
                  <div>
                    <span className="block text-[11px] text-faint">Area</span>
                    <strong>{p.sqft ? `${p.sqft} sqft` : '—'}</strong>
                  </div>
                  <div>
                    <span className="block text-[11px] text-faint">Price</span>
                    <strong className="text-success">₹{(p.price / 10000000).toFixed(2)} Cr</strong>
                  </div>
                </div>

                {Array.isArray(p.amenities) && p.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.amenities.slice(0, 4).map((a: string, i: number) => (
                      <span
                        key={i}
                        className="rounded-[5px] border border-border bg-surface px-2 py-0.5 text-[11px] text-muted"
                      >
                        {a}
                      </span>
                    ))}
                    {p.amenities.length > 4 && (
                      <span className="rounded-[5px] border border-border bg-surface px-2 py-0.5 text-[11px] text-faint">
                        +{p.amenities.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}