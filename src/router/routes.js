
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout'),
    children: [
      {
        name: 'home',
        path: '',
        component: () => import('pages/chatGPT'),
        meta: {
          isOpen: true
        },
      },
      {
        name: 'ChatGpt',
        path: 'chat',
        component: () => import('pages/chatGPT'),
        meta: {
          isOpen: true
        },
      },
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
