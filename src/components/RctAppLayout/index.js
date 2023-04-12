/**
 * App Routes
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Sidebar from 'react-sidebar';
import $ from 'jquery';
import { Scrollbars } from 'react-custom-scrollbars';
import classnames from 'classnames';

// Components
import Header from 'Components/Header/Header';
import SidebarContent from 'Components/Sidebar';
import Footer from 'Components/Footer/Footer';
import Tour from 'Components/Tour';
import ThemeOptions from 'Components/ThemeOptions/ThemeOptions';
import SideBarPro from 'Components/SideBarPro';
import { ProSidebarProvider } from 'react-pro-sidebar';

// preload Components
import PreloadHeader from 'Components/PreloadLayout/PreloadHeader';
import PreloadSidebar from 'Components/PreloadLayout/PreloadSidebar';


// app config
import AppConfig from 'Constants/AppConfig';

// actions
import { collapsedSidebarAction, startUserTour } from 'Actions';

class MainApp extends Component {

    state = {
        loadingHeader: true,
        loadingSidebar: true
    }

    componentWillMount() {
        this.updateDimensions();

    }

    componentDidMount() {
        const { windowWidth } = this.state;
        window.addEventListener("resize", this.updateDimensions);
        if (AppConfig.enableUserTour && windowWidth > 600) {
            setTimeout(() => {
                this.props.startUserTour();
            }, 2000);
        }
        setTimeout(() => {
            this.setState({ loadingHeader: false, loadingSidebar: false });
        }, 114);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    componentWillReceiveProps(nextProps) {
        const { windowWidth } = this.state;
        if (nextProps.location !== this.props.location) {
            if (windowWidth <= 1199) {
                this.props.collapsedSidebarAction(false);
            }
        }
    }

    updateDimensions = () => {
        this.setState({ windowWidth: $(window).width(), windowHeight: $(window).height() });
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            window.scrollTo(0, 0);
        }
    }

    renderPage() {
        const { pathname } = this.props.location;
        const { children } = this.props;
        if (pathname === '/app/chat' || pathname.startsWith('/app/mail') || pathname === '/app/todo') {
            return (
                <div className="rct-page-content p-0">
                    {children}
                </div>
            );
        }
        return (
            <Scrollbars
                className="rct-scroll"
                autoHide
                autoHideDuration={100}
                style={this.getScrollBarStyle()}
            >
                <div className="rct-page-content">
                    {children}
                    <Footer />
                </div>
            </Scrollbars>
        );
    }

    // render header
    renderHeader() {
        const { loadingHeader } = this.state;
        if (loadingHeader) {
            return <PreloadHeader />;
        }
        return <Header />
    }

    //render Sidebar
    renderSidebar() {
        const { loadingSidebar } = this.state;
        if (loadingSidebar) {
            return <PreloadSidebar />;
        }
        return <SideBarPro />;
    }

    //Scrollbar height
    getScrollBarStyle() {
        return {
            height: '100%'
        }
    }

    render() {
        const { navCollapsed, rtlLayout, miniSidebar } = this.props.settings;
        const { windowWidth } = this.state;
        return (
            <ProSidebarProvider>
            <div className="app">
                <div className="app-main-container">
                    <Tour />
                    <Sidebar
                        sidebar={this.renderSidebar()}
                        open={true}
                        docked={true}
                        pullRight={rtlLayout}
                        onSetOpen={() => this.props.collapsedSidebarAction(false)}
                        styles={{ sidebar: { zIndex: "10" }, content: { overflowY: '', position: 'initial', marginLeft: miniSidebar ? '80px' : '250px', transition: 'margin-left 0.15s 0.15s' } }}
                        contentClassName={classnames({ 'app-conrainer-wrapper': miniSidebar })}
                    >
                                            
                        <div style={{ height: "100vh" }} className="app-container">
                            <div style={{ height: "100%" }} className="rct-app-content">
                                <div style={{ height: "100%" }} className="rct-page">
                                    {this.renderPage()}
                                </div>
                            </div>
                        </div>
                    </Sidebar>
                    <ThemeOptions />
                </div>
            </div>
            </ProSidebarProvider>
        );
    }
}

// map state to props
const mapStateToProps = ({ settings }) => {
    return { settings }
}

export default withRouter(connect(mapStateToProps, {
    collapsedSidebarAction,
    startUserTour
})(MainApp));
