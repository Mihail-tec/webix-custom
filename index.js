webix.ready(function () {
  webix.protoUI(
    {
      name: "mybutton",
      $cssName: "button",
      $init: function (config) {
        console.log(config);
        const state = config.value || 0;
        config.value = config.states[state];
        webix.html.addCss(this.$view, `state_${state}`);

        this.attachEvent("onItemClick", () => {
          let state = this.config.state;
          webix.html.removeCss(this.$view, `state_${state}`);

          state++;
          if (state > 2) {
            state = 0;
          }
          this.config.state = state;
          this.config.label = this.config.states[state];

          this.refresh();

          webix.html.addCss(this.$view, `state_${state}`);
          this.callEvent("onStateChange", [state]);
        });
      },
    },
    webix.ui.button
  );

  webix.protoUI(
    {
      name: "formControl",
      $init: function (config) {
        console.log(config);
        const cancel =
          config?.cancelAction ??
          function () {
            webix.message("cancel");
            $$("formControl").clear();
          };
        const save =
          config?.saveAction ??
          function () {
            webix.message("save");
            $$("formControl").clear();
          };
        const buttonForm = {
          cols: [
            {
              view: "button",
              value: "Cancel",
              on: {
                onItemClick: cancel,
              },
            },
            {},
            {
              view: "button",
              value: "Save",
              css: "webix_primary",
              on: {
                onItemClick: save,
              },
            },
          ],
        };

        const fields = config.fields.map((el) => {
          return { view: "text", name: el, label: el };
        });
        console.log(fields);
        config.elements = [...fields, buttonForm];
      },
    },
    webix.ui.form
  );

  webix.ui({
    cols: [list, { view: "resizer" }, form],
  });
});

const list = {
  rows: [
    {
      cols: [
        { view: "label", label: "Sort list: ", align: "center" },
        {
          view: "mybutton",
          gravity: 3,
          states: { 0: "Off", 1: "Sort Asc", 2: "Sort Desc" },
          state: 0,
          on: {
            onStateChange: function (state) {
              const list = $$("myList");
              if (state == 0) {
                list.sort("id", "asc");
              } else if (state == 1) {
                list.sort("year", "asc");
              } else {
                list.sort("year", "desc");
              }
            },
          },
        },
      ],
    },
    {
      view: "list",
      id: "myList",
      data: big_film_set,
      type: {
        height: "auto",
      },
      template: "<strong>#id#. #title#</strong><br> Year: #year#, rank: #rank#",
    },
  ],
};

const form = {
  view: "formControl",
  id: "formControl",
  fields: ["one", "two", "three"],
  saveAction: () => {
    webix.message("Button save work");
    $$("formControl").clear();
  },
  cancelAction: () => {
    webix.message("Button cancel work");
    $$("formControl").clear();
  },
};
