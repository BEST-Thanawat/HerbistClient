import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'shop/product/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'pages/order/success/:id',
    renderMode: RenderMode.Client,
  },
];
