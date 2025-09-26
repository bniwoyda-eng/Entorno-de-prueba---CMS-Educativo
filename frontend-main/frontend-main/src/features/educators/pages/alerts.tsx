import { CustomAlert } from "../../../utils/custom-alert";

export const Alerts = () => {
  return (
    <div className="page-base">
      <h1 className="font-semibold text-3xl mb-4">Alerts</h1>
      <div className="flex gap-3 mb-4">
        <button
          className="btn btn-main"
          onClick={() => CustomAlert.toast("success")}
        >
          Success toast
        </button>
        <button
          className="btn btn-main"
          onClick={() => CustomAlert.toast("error", "Mensaje de error")}
        >
          Error toast
        </button>
        <button
          className="btn btn-main"
          onClick={() => CustomAlert.toast("warning", "Mensaje de advertencia")}
        >
          Warning toast
        </button>
        <button
          className="btn btn-main"
          onClick={() => CustomAlert.toast("info", "Mensaje de información")}
        >
          Info toast
        </button>
        <button
          className="btn btn-main"
          onClick={() => CustomAlert.toast("question", "Mensaje de pregunta")}
        >
          Question toast
        </button>
      </div>
      <div className="flex gap-3 mb-4">
        <button
          className="btn btn-main"
          onClick={() =>
            CustomAlert.alert("error", {
              title: "Título de error",
              description: "Este es un mensaje de error personalizado",
            })
          }
        >
          Error alert
        </button>
        <button
          className="btn btn-main"
          onClick={() =>
            CustomAlert.alert("success", { title: "Solo título de éxito" })
          }
        >
          Success alert
        </button>
        <button
          className="btn btn-main"
          onClick={() =>
            CustomAlert.alert("success", {
              description: "Solo descripción de éxito",
            })
          }
        >
          Success alert
        </button>
        <button
          className="btn btn-main"
          onClick={() => CustomAlert.alert("success")}
        >
          Success alert
        </button>
      </div>
      <div className="flex gap-3 mb-4">
        <button
          className="btn btn-main"
          onClick={() =>
            CustomAlert.confirm({ title: "Confirmación de advertencia" })
          }
        >
          Confirm alert
        </button>
      </div>
    </div>
  );
};
