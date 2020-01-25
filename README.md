# vesta

**[Vesta Rayan Afzar](http://vestarayanafzar.com) Client Code Boilerplate**

Develop all targets using a single codebase.

**Attention:**
Do NOT clone this repository directly, use [vesta](https://github.com/VestaRayanAfzar/vesta) to create your project.

`vesta create projectName --type=client`

use `vesta create --help` for more information

### Development

Change `api` value to your api server address from `src/config/variantConfig.ts`.
Also modify the common Configurations from `src/cmn/config/cmnConfig.ts`.

You can use [vesta](https://github.com/VestaBoot/vesta) code generator to create new models and components.
Use `vesta gen --help` for more information.

### Production

Production mode configuration file is located at `resources/gitignore/variantConfig.ts`.
There is a bash script in `resources/ci/deploy.sh` (change it to cover your needs).

On target system (production) you have to install [vesta](https://github.com/VestaRayanAfzar/vesta) platform. Then run `vesta deploy [https://git/repo.git]`.

Current deploy script is set to serve client files statically using nginx.
