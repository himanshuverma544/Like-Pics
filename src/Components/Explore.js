// react hooks
import { useState, useEffect, useRef, useCallback, memo } from "react";

// remote-data management libraries
import Axios from "axios";

// frontend libraries
import { Container, Row, Col, Button, Form, Input, InputGroup } from "reactstrap";
import { BsSearch } from "react-icons/bs";

// functions
import { useGetImage, useTypewriter } from "../customHooks";

// components
import ButtonsPanel from "./ButtonsPanel";
import ThemeSwitcher from "./ThemeSwitcher";
import AutoSuggestions from "./AutoSuggestions";
import ImagesShowCase from "./ImagesShowCase";

// redux
import { useDispatch } from "react-redux";
import { searchImages, loadImages } from "../redux/imagesSlice";

// data
import popularImageSearchWords from "../assets/arrays/popularImageSearchWords";


const Explore = () => {

  const [searchQuery, setSearchQuery] = useState("");

  const vals = useRef({
    storeSearchQuery: "",
    loadPageNum: 1,
  });

  const searchValueNode = useRef(null);

  const imagesDispatch = useDispatch();


  const fetchPhotos = useCallback(async () => {

    const URL = "https://api.unsplash.com/search/photos";

    const { data: {results} } = await Axios.get(URL, {
      params: {
        query: vals.current.storeSearchQuery,
        page: vals.current.loadPageNum,
        per_page: 28,
        client_id: process.env.REACT_APP_UNSPLASH_API_ACCESS_KEY
      },
    });

    const imagesToLoad = results.map(image => {
      const imgReqData = {
        id : image.id,
        urls : {
          regular : image.urls.regular,
          thumb : image.urls.thumb
        },
        alt : image.alt_description,
        actions: {
        likes : image.likes,
        download: image.links.download
        },
        photographer: {
          fullName: image.user.name,
          profile: `${image.user.links.html}/?utm_source=like_pics&utm_medium=referral`
        },
        unsplashUrl: "https://unsplash.com/?utm_source=like_pics&utm_medium=referral"
      }
      return imgReqData;
    });

    return imagesToLoad;

  }, []);


  const handleSearchImages = useCallback(async (event, selectedSearchVal = "") => {

    if (event) {
      event.preventDefault();
    }
    searchValueNode.current.blur();

    vals.current.storeSearchQuery = !selectedSearchVal ? searchQuery : selectedSearchVal;
    vals.current.loadPageNum = 1;

    const imagesToLoad = await fetchPhotos();
    imagesDispatch(searchImages(imagesToLoad));

  }, [searchQuery, fetchPhotos, imagesDispatch]);


  const handleLoadImages = useCallback(async () => {

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
      ++vals.current.loadPageNum;
      const imagesToLoad = await fetchPhotos();
      imagesDispatch(loadImages(imagesToLoad));
    }

  }, [fetchPhotos, imagesDispatch]);

  useEffect(()=> {

      function addingEventListener() {
        window.addEventListener("scroll", handleLoadImages);
      }
      addingEventListener();

      return () => {
        window.removeEventListener("scroll", handleLoadImages);
      }
  
  }, [handleLoadImages]);

  return (
    <Container className="py-3">
    
      <ThemeSwitcher/>

      <Row>
        <Col md={12}>
          <div className="hero-sec d-flex justify-content-center align-items-center position-relative">
            <h1 className="me-3">Like Pics</h1>
            <img className="app-icon" src={useGetImage("like-icon.png")} alt="Like Icon"/>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Form className="position-relative" onSubmit={event => handleSearchImages(event)}>
            <InputGroup>
              <Input
                type="text"
                id="search-field"
                className="ps-3"
                innerRef={searchValueNode}
                onChange={event => setSearchQuery(event.target.value.trim())}
                autoComplete="off"
                placeholder={
                  useTypewriter({
                    leftStaticStr: "Search for ", 
                    words: popularImageSearchWords, 
                    rightStaticStr: " from the library of over 3.48 million plus photos",
                  })
                }
                autoFocus
              />
              <Button
                className="search-btn"
                color="danger"
              >
                <BsSearch/>
              </Button>
            </InputGroup>
            {/* {<AutoSuggestions
              states={{searchQuery, setSearchQuery}}
              nodes={{searchValueNode}}
              variables={{limit: 5}}
              functions={{handleSearchImages}}
            />} */}
          </Form>
        </Col>
      </Row>
    
      <Row className="images-showcase-row">
        <ImagesShowCase/>
      </Row>
      
      <Row className="btns-panel-row">
        <Col>
          <div className="btns-panel-container d-flex justify-content-center">
            <ButtonsPanel 
              nodes={{ searchValueNode }}
            />
          </div>
        </Col>
      </Row>

    </Container>
  );
};

export default memo(Explore);

// TODO: link in placeholder