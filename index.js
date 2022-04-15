webix.ready(function () {
  webix.protoUI(
    {
      name: "mybutton",
      $cssName: "button",
      $init: function (config) {
        const state = 0;
        if (!config || !config.states) {
          webix.alert("you don't have a state");
        } else {
          config.value = config.states[state] ?? "";
        }

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
        const cancel =
          config?.cancelAction ??
          function () {
            webix.message("cancel");
            $$("formControl").clear();
          };
        const save =
          config?.saveAction ??
          function () {
            if ($$("formControl").isDirty()) {
              const formInitValues = $$("formControl").getValues();
              for (key in formInitValues) {
                if (formInitValues.hasOwnProperty(key)) {
                  console.log(formInitValues[key]);
                  $$("formControl").clear();
                }
              }
              webix.message("save");
            }
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

        if (Array.isArray(config.fields)) {
          const fields = config.fields.map((el) => {
            return { view: "text", name: el, label: el };
          });
          config.elements = [...fields, buttonForm];
        } else {
          webix.alert("you don't have a array");
        }
        
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
    const formValues = $$("formControl").getValues();
    Object.values(formValues).forEach((value) => {
      console.log(value);
      $$("formControl").clear();
    });
  },
  cancelAction: () => {
    webix.message("Button cancel work");
    $$("formControl").clear();
  },
};
