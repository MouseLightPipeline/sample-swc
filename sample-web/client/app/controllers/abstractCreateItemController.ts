abstract class AbstractCreateItemController<T extends IApiResourceItem<T>> {
  constructor(protected $scope: any, protected service: DataService<T>, protected modalElementId: string, protected eventName: string) {
    this.$scope.item = {};
    this.$scope.item.name = "";
    this.$scope.errorMessage = "";

    this.$scope.createItem = () => this.createItem();

    $(modalElementId).on("show.bs.modal", () => { this.resetDialog(); });
  }

  private createItem() {
    this.service.createItem(this.createObject()).then((item) => {
      this.$scope.$apply(() => {
        this.$scope.$emit(this.eventName, item);
        let element = $(this.modalElementId) as JQuery;
        element.modal("hide");
      });
    }).catch((response) => {
      this.$scope.$apply(() => {
        if (response && response.data && response.data.message) {
          this.$scope.errorMessage = response.data.message;
        } else {
          this.$scope.errorMessage = "An unknown error occurred creating the item.";
        }
      });
    });
  }

  private resetDialog() {
    this.$scope.$apply(() => {
      this.$scope.errorMessage = "";
    });
  }

  protected abstract createObject(): any;
}
