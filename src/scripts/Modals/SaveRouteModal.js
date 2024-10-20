import {components, userConfig, utils} from "../../Globals";
import {FacDriveRoutes} from "../routes/FacDriveRoutes";

export class SaveRouteModal {
    static init(successEvent, container, route) {
        const modal = document.createElement('div');
        modal.setAttribute('class', 'save-route-modal');

        const routeName = components.input.createInput({
            label: 'Nome da rota',
            input: {
                id: 'route-name',
                class: 'route-name',
                type: 'text',
                placeholder: 'Digite o nome da rota'
            },
            tip: "Digite um nome para a sua rota, dessa forma será possivel acessa-lá posteriormente."
        })

        const saveButton = components.button.genericButton({
            icon: 'fa-regular fa-floppy-disk',
            class: 'large-button height-50 green',
            label: 'Salvar',
            event: async () => {
                const routeName = document.getElementById('route-name')?.value;
                if (routeName) {
                    const routePoints = utils.map.formatRoutePoints(route);
                    await FacDriveRoutes.saveRoute(userConfig.iduser, routeName, routePoints);
                    components.alert.init('A sua rota foi salva com sucesso!', 'success');
                    components.darkBackground.exit('save-route-modal-background');
                    successEvent();
                    return;
                }
                components.alert.init('Preencha o nome da rota antes de salvar', 'error');
            }
        });

        const exitButton = components.button.createExitButton({
            id: 'exit-save-route-modal',
            event: () => {
                components.darkBackground.exit('save-route-modal-background');
            }
        });

        modal.append(exitButton, routeName, saveButton);
        components.darkBackground.create(container, modal, 'save-route-modal-background');
    }
}