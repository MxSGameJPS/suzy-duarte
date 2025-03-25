import { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "../Components/Botão";
import ButtonVip from "../Components/BotaoVip";
import { FaChevronDown } from "react-icons/fa";

export default function DobraUm() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const bgInterval = useRef(null);
  const [showScrollIcon, setShowScrollIcon] = useState(true);

  // Array de imagens para o background em telas pequenas
  const bgImages = [
    "/img/1.jpeg",
    "/img/2.jpeg",
    "/img/3.jpeg",
    "/img/4.jpeg",
    "/img/5.jpeg",
    "/img/6.jpg",
    "/img/7.jpg",
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Função para ajustar o valor da máscara com base no tamanho da tela
    const ajustarMascara = () => {
      let valorMaskSize;

      // Ajustes específicos baseados no tamanho da tela
      if (window.innerWidth <= 480) {
        // Para mobile pequeno
        valorMaskSize = "8000vw";
      } else if (window.innerWidth <= 768) {
        // Para tablets
        valorMaskSize = "7000vw";
      } else if (window.innerWidth <= 1000) {
        // Para desktop pequeno
        valorMaskSize = "6000vw";
      } else {
        // Para desktop grande
        valorMaskSize = "6000vw";
      }

      // Armazenar o estado atual da janela
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Limpar ScrollTriggers anteriores para evitar sobreposição
      ScrollTrigger.getAll().forEach((st) => st.kill());

      // Definir uma velocidade de scrub apropriada com base no dispositivo
      const scrubSpeed = window.innerWidth <= 768 ? 1 : 2;

      // Ajustar o ponto final da animação para dispositivos móveis
      const endPosition =
        window.innerWidth <= 768 ? "bottom 50%" : "bottom 170%";

      // Aplicar a animação da máscara com valores ajustados
      gsap.to(".mask", {
        maskSize: valorMaskSize,
        maskPosition: "25% center",
        scrollTrigger: {
          trigger: ".mask",
          scrub: scrubSpeed,
          start: "top top",
          end: endPosition,
          markers: false,
        },
      });

      // Adicionar ScrollTrigger para controlar a visibilidade do ícone
      ScrollTrigger.create({
        trigger: ".mask",
        start: "top top",
        end: "+=100",
        onUpdate: (self) => {
          // Esconder o ícone quando começar a rolar
          if (self.progress > 0.05) {
            setShowScrollIcon(false);
          } else {
            setShowScrollIcon(true);
          }
        },
      });

      // Configurar a oscilação de background apenas para telas pequenas
      if (window.innerWidth <= 768) {
        // Se já existir um intervalo, limpe-o
        if (bgInterval.current) {
          clearInterval(bgInterval.current);
        }

        // Configure um novo intervalo para telas pequenas
        bgInterval.current = setInterval(() => {
          setCurrentBgIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
        }, 3000); // Muda a imagem a cada 3 segundos
      } else {
        // Em telas grandes, pare qualquer oscilação existente
        if (bgInterval.current) {
          clearInterval(bgInterval.current);
          bgInterval.current = null;
          setCurrentBgIndex(0); // Resetar para o estado inicial
        }
      }
    };

    // Executar ajuste inicial
    ajustarMascara();

    // Adicionar listener para redimensionamento da janela
    window.addEventListener("resize", ajustarMascara);

    // Adicionar listener para mudança de orientação
    window.addEventListener("orientationchange", ajustarMascara);

    // Limpar listeners ao desmontar o componente
    return () => {
      window.removeEventListener("resize", ajustarMascara);
      window.removeEventListener("orientationchange", ajustarMascara);
      // Limpar ScrollTriggers para evitar duplicação
      ScrollTrigger.getAll().forEach((st) => st.kill());
      // Limpar o intervalo de oscilação do background
      if (bgInterval.current) {
        clearInterval(bgInterval.current);
      }
    };
  }, []);

  // Determinar classe de orientação para ajustes de estilo
  const orientationClass =
    windowSize.width > windowSize.height ? "landscape" : "portrait";

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <PageWrapper>
      {showScrollIcon && (
        <ScrollIndicator onClick={handleScrollDown}>
          <FaChevronDown size={24} />
          <ScrollText>Role para baixo</ScrollText>
        </ScrollIndicator>
      )}
      <Mask className={`mask ${orientationClass} gpu-accelerated`}>
        <Background
          $isSmallScreen={windowSize.width <= 768}
          $bgImage={
            windowSize.width <= 768 ? bgImages[currentBgIndex] : "/1.svg"
          }
        />
        <Content className="content">
          <TextContainer $isMobile={windowSize.width <= 768}>
            <Heading>Quero te satisfazer</Heading>
            <Paragraph>Só depende de você. Vem ver o que eu tenho! </Paragraph>
            <ButtonContainer>
              <Button />
              <ButtonVip />
            </ButtonContainer>
          </TextContainer>
        </Content>
      </Mask>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  position: relative;
  min-height: 200vh;
  width: 100%;
  overflow-x: hidden;
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const fadeInOut = keyframes`
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
`;

const ScrollIndicator = styled.div`
  position: fixed;
  bottom: 25%;
  left: 40%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #a72f66;
  animation: ${bounce} 2s infinite, ${fadeInOut} 2s infinite;
  z-index: 15;
  pointer-events: auto;
  cursor: pointer;

  svg {
    filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.7));
  }

  @media (max-width: 768px) {
    bottom: 20%;
  }

  @media (max-width: 480px) {
    bottom: 15%;
  }
`;

const ScrollText = styled.span`
  font-size: 14px;
  margin-top: 5px;
  font-weight: 600;
  color: #a72f66;
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.7);

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const Background = styled.div`
  background-image: url(${(props) => props.$bgImage});
  background-size: cover;
  background-position: center;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 0;
  transition: ${(props) =>
    props.$isSmallScreen ? "background-image 1s ease-in-out" : "none"};
`;

const Mask = styled.div`
  &.mask {
    mask-image: url("/F1.svg");
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: 100%;
    transition: mask-size 0.3s ease-out;
    height: 100vh;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 1;
  }

  /* Ajustes específicos para orientação paisagem */
  &.landscape {
    mask-position: center center;
  }

  /* Ajustes específicos para orientação retrato */
  &.portrait {
    mask-position: center center;
  }

  @media (max-width: 1000px) {
    &.mask {
      mask-size: 100%;
    }
  }

  @media (max-width: 768px) {
    &.mask {
      mask-size: 100%;
      transition: mask-size 0.2s ease-out;
    }
  }

  @media (max-width: 480px) {
    &.mask {
      mask-size: 100%;
    }
  }
`;

const Content = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
  z-index: 2;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
    align-items: flex-end;
    justify-content: flex-start;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin-bottom: ${(props) => (props.$isMobile ? "10vh" : "10vh")};
  padding: 0 5%;

  @media (max-width: 768px) {
    margin-bottom: 0;
    padding: 0 4%;
    position: relative;
    bottom: 8vh;
  }

  @media (max-width: 480px) {
    padding: 0 3%;
    position: relative;
    bottom: 5vh;
  }
`;

const Heading = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  color: rgb(173, 9, 151);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  text-align: left;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: clamp(1.8rem, 4.5vw, 3rem);
    margin-bottom: 0.7rem;
  }

  @media (max-width: 480px) {
    font-size: clamp(1.6rem, 4vw, 2.5rem);
    margin-bottom: 0.5rem;
    color: rgb(188, 10, 164);
  }
`;

const Paragraph = styled.p`
  font-size: clamp(1rem, 3vw, 1.5rem);
  font-weight: 500;
  color: rgb(114, 1, 99);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  text-align: left;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: clamp(0.9rem, 2.5vw, 1.3rem);
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: clamp(0.8rem, 2vw, 1.1rem);
    margin-bottom: 1rem;
    color: rgb(129, 2, 111);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap; /* Permite que os botões quebrem linha em telas pequenas */

  @media (max-width: 768px) {
    gap: 15px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;
