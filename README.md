# vesta

**[Vesta Rayan Afzar](http://vestarayanafzar.com) Client Code Boilerplate**

Develop all targets using a single codebase.

**Attention:** 
Do NOT clone this repository directly, use [vesta](https://github.com/VestaRayanAfzar/vesta) to create your project.

`vesta create projectName --type=client`

use `vesta create --help` for more information

### Development
Change `api` value to your api server address from `src/client/app/config/variantConfig.ts`.
Also modify the common Configurations from `src/client/app/cmn/config/cmnConfig.ts`.

Depends on your target [`web`, `cordova`, `electron`], you may run one of the following npm scripts:
- web: `npm run dev:web`
- cordova:
  - android: `npm run dev:android`
  - ios: `npm run dev:ios`
- electron: `npm run dev:electron`

In case of targeting `web`, a browser will launch the application.

If you want to work on `cordova`, the root of the project will be `vesta/client/cordova`.
You can execute all `cordova` commands from this directory.

You can use [vesta](https://github.com/VestaRayanAfzar/vesta) code generator to create new models and components.
Use `vesta gen --help` for more information.

#### Target based development
In order to use a section of code for specific target you can wrap that section like this:

```
//<targetName>
your targetName specific code goes here...
//</targetName>
```

Valid targets are:
- `web`
- `cordova`, `android`, `ios`
- `electron`
- `development`
- `production`

for example if you want to target both `android` or `ios`, you may wrap that section in `cordova` wrapper:

```
//<cordova>
your cordova (android/ios) specific code goes here...
//</cordova>
```

for android specific code you may use:

```
//<android>
your android specific code goes here...
//</android>
```

You may also use `!` operator to exclude a target:

```
//<!cordova>
your none cordova (web/electron) specific code goes here...
//</cordova>
```

All these code eliminations occur at build time using `resources/gulp/plugins/eliminator` gulp plugin.

### Production
Production mode configuration file is located at `resources/gitignore/variantConfig.ts`.
There is a bash script in `resources/ci/deploy.sh` (change it to cover your needs).

On target system (production) you have to install [vesta](https://github.com/VestaRayanAfzar/vesta) platform. Then run `vesta deploy [https://git/repo.git]`.

Current deploy script is set to serve client files statically using nginx.
