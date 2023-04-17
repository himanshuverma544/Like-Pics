import { useState, useEffect, useRef, useContext, memo } from "react";

import globalDataContext from "../contextAPI/globalData/context";
import { storeInGlobalData } from "../contextAPI/globalData/action.creators";

import { Row, Col } from "reactstrap";
import { MdOutlineLightMode, MdOutlineNightlight } from "react-icons/md";

import getThemeStyles from "../assets/objects/getThemeStyles";

const ThemeSwitcher = () => {

  const [theme, setTheme] = useState(() => {
    const localTheme = localStorage.getItem("localTheme");
    return localTheme ? localTheme : "dark";
  });
  const currentTheme = getThemeStyles[theme];

  const themeNode = useRef(null);

  const { dispatch } = useContext(globalDataContext);


  // useEffect(() => {
  //   function storeGlobalData() {
  //     dispatch(storeInGlobalData("ButtonPanel", "states", {setTheme}));
  //     dispatch(storeInGlobalData("ButtonPanel", "states", {theme}));
  //   }
  //   storeGlobalData();
  // }, [dispatch]);

  useEffect(() => {
    function setLocalTheme() {
      localStorage.setItem("localTheme", theme);
    }
    setLocalTheme();
  }, [theme]);


  useEffect(() => {

    function switchTheme() {

      document.body.style.backgroundColor = currentTheme.body.backgroundColor;

      ["h1", "h6"].forEach(headingTags => {
        document.querySelectorAll(headingTags).forEach(element => 
          element.style.color = currentTheme.heading.textColor
        );
      });

      document.querySelector(".theme-icon").style.fill = currentTheme.themeIcon.fill;
      
      const btnsPanelOpenIcon = document.querySelector(".btns-panel-container .open-icon");
      btnsPanelOpenIcon.style.backgroundColor = currentTheme.btnsPanelOpenIcon.backgroundColor;
      btnsPanelOpenIcon.style.stroke = currentTheme.btnsPanelOpenIcon.stroke;

      document.querySelectorAll(".panel-btn").forEach(btn => {

        btn.style.backgroundColor = currentTheme.btnsPanelBtns.default.backgroundColor;
           
        btn.addEventListener("mouseover", () => 
          btn.style.backgroundColor = currentTheme.btnsPanelBtns.onHover.backgroundColor
        );
        
        btn.addEventListener("mouseout", () => 
          btn.style.backgroundColor = currentTheme.btnsPanelBtns.default.backgroundColor
        );
        
      });

      document.querySelectorAll(".panel-icon").forEach(icon =>
        icon.style.fill = currentTheme.btnsPanelBtnsIcons.fill
      );
    }
    switchTheme();

  }, [currentTheme]);

  return (
    <Row>
      <Col md={12}>
        <div rel={themeNode} onClick={() => setTheme(prevTheme => prevTheme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <MdOutlineLightMode className="theme-icon"/> : <MdOutlineNightlight className="theme-icon dark-theme-icon"/>} 
        </div> 
      </Col>
    </Row>
  );
};

export default memo(ThemeSwitcher);
