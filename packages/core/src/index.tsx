import React, { ReactElement, ReactNode } from "react";

import Browser from "./components/Browser";
import { Message, DjangoRenderResponse, djangoGet } from "./fetch";
import { Frame, useNavigationController } from "./navigation";
import { DirtyFormScope } from "./dirtyform";
import Link, { BuildLinkElement, buildLinkElement } from "./components/Link";
import Config from "./config";
import Form from "./components/Form";
import { MessagesContext } from "./contexts";
import Overlay from "./components/Overlay";

export interface AppProps {
  config: Config;
  initialResponse: DjangoRenderResponse | JSON;
}

export function App({ config, initialResponse }: AppProps): ReactElement {
  // Toast messages state
  const [messages, setMessages] = React.useState<Message[]>([]);
  const pushMessage = React.useCallback(
    (message: Message) => {
      setMessages(messages.concat([message]));
    },
    [messages]
  );

  const onServerError = React.useCallback(
    (kind: "server" | "network") => {
      if (kind === "server") {
        pushMessage({
          level: "error",
          text: "A server error occurred. Please try again later.",
        });
      } else if (kind === "network") {
        pushMessage({
          level: "error",
          text: "A network error occurred. Please check your internet connection or try again later.",
        });
      }
    },
    [pushMessage]
  );

  // Overlay state
  const [overlay, setOverlay] = React.useState<{
    render(content: ReactNode): ReactNode;
    initialResponse: DjangoRenderResponse;
    initialPath: string;
  } | null>(null);
  const [overlayCloseRequested, setOverlayCloseRequested] =
    React.useState(false);
  const overlayCloseListener = React.useRef<(() => void) | null>(null);

  // Close overlay when we navigate the main window
  // We can force close in this situation, since we've already checked if there are any dirty forms
  const onNavigation = (_frame: Frame | null, newFrame: boolean) => {
    // Close overlay when we navigate the main window
    // We can force close in this situation, since we've already checked if there are any dirty forms
    // Only close overlay if a new frame is being pushed
    // This prevents the overlay from closing when refreshProps is called
    if (overlay && newFrame) {
      setOverlayCloseRequested(true);
    }
  };

  const initialPath =
    window.location.pathname + window.location.search + window.location.hash;
  const navigationController = useNavigationController(
    null,
    config.unpack,
    initialResponse as DjangoRenderResponse,
    initialPath,
    {
      onNavigation,
      onServerError,
    }
  );

  React.useEffect(() => {
    // Remove the loading screen
    const loadingScreen = document.querySelector(".django-render-load");
    if (loadingScreen instanceof HTMLElement) {
      loadingScreen.classList.add("django-render-load--hidden");
      setTimeout(() => {
        loadingScreen.remove();
      }, 200);
    }

    // Add listener for popState
    // This event is fired when the user hits the back/forward links in their browser
    const navigate = () => {
      // eslint-disable-next-line no-void
      void navigationController.navigate(document.location.pathname, false);
    };

    window.addEventListener("popstate", navigate);
    return () => {
      window.removeEventListener("popstate", navigate);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openOverlay = async (
    path: string,
    renderOverlay: (content: ReactNode) => ReactNode,
    { onClose }: { onClose?: () => void } = {}
  ) => {
    const initialOverlayResponse = await djangoGet(path, true);

    if (onClose) {
      overlayCloseListener.current = onClose;
    }

    setOverlay({
      render: renderOverlay,
      initialResponse: initialOverlayResponse,
      initialPath: path,
    });
    setOverlayCloseRequested(false);
  };

  const messagesContext = React.useMemo(
    () => ({ messages, pushMessage }),
    [messages, pushMessage]
  );

  return (
    <div>
      <DirtyFormScope handleBrowserUnload>
        <MessagesContext.Provider value={messagesContext}>
          {overlay && (
            <DirtyFormScope>
              <Overlay
                config={config}
                initialResponse={overlay.initialResponse}
                initialPath={overlay.initialPath}
                parentNavigationContoller={navigationController}
                render={(content) => overlay.render(content)}
                requestClose={() => setOverlayCloseRequested(true)}
                closeRequested={overlayCloseRequested}
                onCloseCompleted={() => {
                  setOverlay(null);
                  setOverlayCloseRequested(false);

                  // Call overlay close listener
                  if (overlayCloseListener.current) {
                    overlayCloseListener.current();
                    overlayCloseListener.current = null;
                  }
                }}
                onServerError={onServerError}
              />
            </DirtyFormScope>
          )}
          {!navigationController.isLoading() && (
            <Browser
              config={config}
              navigationController={navigationController}
              openOverlay={(url, renderOverlay, options) =>
                // eslint-disable-next-line no-void
                void openOverlay(url, renderOverlay, options)
              }
            />
          )}
        </MessagesContext.Provider>
      </DirtyFormScope>
    </div>
  );
}

export {
  NavigationContext,
  OverlayContext,
  FormWidgetChangeNotificationContext,
  FormSubmissionStatus,
  MessagesContext,
} from "./contexts";
export type { Navigation } from "./contexts";
export { DirtyFormContext, DirtyFormMarker } from "./dirtyform";
export type { DirtyForm } from "./dirtyform";
export { NavigationController } from "./navigation";
export type { Frame } from "./navigation";
export type { DjangoRenderResponse as Response };
export { Link, BuildLinkElement, buildLinkElement };
export type { Message };
export { Config };
export { Form };
