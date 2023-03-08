import { useState } from 'react';

// interface UseSwatchReorderingReturn {
//   moveSwatch: (startIndex: number, endIndex: number) => void;
// }

// export const useSwatchReordering = <T>(initialItems: T[]) => {
//   const [items, setItems] = useState<T[]>(initialItems);

//   const moveItem = (startIndex: number, endIndex: number) => {
//     const result = Array.from(items);
//     const [removed] = result.splice(startIndex, 1);
//     // ^?
//     removed && result.splice(endIndex, 0, removed);
//     setItems(result);
//   };

//   return {
//     moveItem,
//   };
// };


// import { useCallback, useContext } from 'react';
// import { PaletteContext } from '../palette-context3';
// import { reorderArray } from '@/utils';

// export const useSwatchReordering2 = () => {
//   const { palettes, activePaletteIndex, updateSwatch } =
//     useContext(PaletteContext);

//   const moveSwatch = useCallback(
//     (sourceIndex: number, destinationIndex: number) => {
//       if (activePaletteIndex === null) {
//         return;
//       }

//       const sourcePalette = palettes[activePaletteIndex];
//       if (sourcePalette === undefined) {
//         return;
//       }

//       const updatedPalette = reorderArray(
//         sourcePalette,
//         sourceIndex,
//         destinationIndex
//       );

//       updatedPalette.forEach((swatch, index) => {
//         updateSwatch(index, swatch);
//       });
//     },
//     [activePaletteIndex, palettes, updateSwatch]
//   );

//   const sortSwatches = useCallback(
//     (compareFn: (a: string, b: string) => number) => {
//       if (activePaletteIndex === null) {
//         return;
//       }

//       const sourcePalette = palettes[activePaletteIndex];
//       if (sourcePalette === undefined) {
//         return;
//       }

//       const updatedPalette = Array.from(sourcePalette).sort(compareFn);
//       updatedPalette.forEach((swatch, index) => {
//         updateSwatch(index, swatch);
//       });
//     },
//     [activePaletteIndex, palettes, updateSwatch]
//   );

//   return { moveSwatch, sortSwatches };
// };
