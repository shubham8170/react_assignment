import { Header } from "../Header";

export const About = () => {
  return (
    <>
      <div className="page-wraper header-fixed">
        <Header text="About" />

        <div className="page-content">
          <div className="container">
            <h6 className="title">About us</h6>
            <ul className="list-style-1">
              <li>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
