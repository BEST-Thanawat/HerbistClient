import { Routes } from '@angular/router';
import { HerbistComponent } from './herbist.component';

export const home: Routes = [
  {
    path: '',
    component: HerbistComponent,
    loadChildren: () => import('./../shared/lazy-loaded.module').then((m) => m.LazyLoadedModule),
  },
];

// 102.6 Browser bundles
// 102.6 Initial chunk files   | Names                  |  Raw size | Estimated transfer size
// 102.6 styles-SSEX37KI.css   | styles                 | 793.76 kB |                80.99 kB
// 102.6 chunk-AXW7IHH4.js     | -                      | 484.78 kB |               121.15 kB
// 102.6 chunk-ID4RDSBX.js     | -                      |  60.86 kB |                15.00 kB
// 102.6 chunk-SSNVARGT.js     | -                      |  59.93 kB |                16.30 kB
// 102.6 chunk-SUOZIYPL.js     | -                      |  43.09 kB |                11.74 kB
// 102.6 polyfills-6YOLJV4E.js | polyfills              |  34.63 kB |                11.37 kB
// 102.6 chunk-YQTFPI4J.js     | -                      |  33.40 kB |                 8.17 kB
// 102.6 scripts-TEPIOX6S.js   | scripts                |  20.75 kB |                 6.14 kB
// 102.6 main-4L7MZJXY.js      | main                   |  20.60 kB |                 5.87 kB
// 102.6 chunk-M52E5ORC.js     | herbist-component      |  16.84 kB |                 4.67 kB
// 102.6 chunk-UHIM52UD.js     | -                      |   9.48 kB |                 2.90 kB
// 102.6 chunk-VY46BTC7.js     | -                      |   3.57 kB |               938 bytes
// 102.6 chunk-SE5JAREP.js     | -                      |   1.32 kB |               605 bytes
// 102.6 chunk-LOYPYPSC.js     | -                      | 506 bytes |               506 bytes


// styles-SSEX37KI.css   | styles                 | 793.76 kB |                80.99 kB
// chunk-NYG7J37Q.js     | -                      | 301.11 kB |                82.94 kB
// chunk-VLRWJC3O.js     | -                      | 184.93 kB |                40.63 kB
// chunk-AFF26MDF.js     | -                      |  60.88 kB |                15.02 kB
// chunk-IKTXN3DU.js     | -                      |  59.96 kB |                16.36 kB
// chunk-MGP5WKSX.js     | -                      |  43.09 kB |                11.74 kB
// polyfills-6YOLJV4E.js | polyfills              |  34.63 kB |                11.37 kB
// chunk-IBGVWDDH.js     | -                      |  33.42 kB |                 8.19 kB
// scripts-TEPIOX6S.js   | scripts                |  20.75 kB |                 6.14 kB
// main-AHD5SFVJ.js      | main                   |  20.69 kB |                 5.88 kB
// chunk-KWVD44TY.js     | -                      |  16.87 kB |                 4.70 kB
// chunk-EEDMT6GJ.js     | -                      |   9.51 kB |                 2.91 kB
// chunk-QK2HTRBG.js     | -                      |   3.58 kB |               932 bytes
// chunk-SE5JAREP.js     | -                      |   1.32 kB |               605 bytes
// chunk-2ESOZWX5.js     | -                      | 538 bytes |               538 bytes