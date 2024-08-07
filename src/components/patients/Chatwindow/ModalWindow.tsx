import { styles } from "@/constants/styles";

//for displaying the model view/Window
function ModalWindow(props) {
  // returning display
  return (
    <div
      style={{
        ...styles.modalWindow,
        ...{ display: props.visible ? "block" : "none" },
      }}
    >
      Hello there!
    </div>
  );
}
export default ModalWindow;
