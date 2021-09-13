# qarobar-pos

Qarobar POS also named as QPOS is a stand along point of sale app that can integrate with ERPNext as well.

RoadMAP:

- [x] Configure Vue Router and Vuex
- [x] Configure axios for nodejs
- [x] Configure Setup Wizard, SQLite and Knex
- [ ] Create Screens for
  - [ ] Item
  - [ ] Item Group
  - [ ] Warehouse
  - [ ] Price List
  - [ ] Item Price
- [ ] Sync Data with ERPNext for:
  - [ ] Item
  - [ ] Item Group
  - [ ] Warehouse
  - [ ] Price List
  - [ ] Item Price

## Setup Wizard

Two step setup wizard as following:

1. Setting Up ERPNext Site
2. Setting database path

The app will create a new sqlite database and save the ERPNext site details for future reference.

## Project setup

```bash
yarn install
```

### Compiles and hot-reloads for development

```bash
yarn electron:serve
```

### Compiles and minifies for production

```bash
yarn electron:build
```

### Lints and fixes files

```bash
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
