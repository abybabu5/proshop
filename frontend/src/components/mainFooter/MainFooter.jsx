import React, {Component} from 'react';
import {Apple, Shop} from "@material-ui/icons";

import "./MainFooter.css";

class MainFooter extends Component {
    render() {
        return (
            <div className="container-fluid footer">
                <div className="footer__column">
                    <div className="footer__heading">Get to Know Us</div>
                    <div><p>About us</p></div>
                    <div><p>Careers</p></div>
                    <div><p>Press Releases</p></div>
                    <div><p>ProShop Wholesale</p></div>
                    <div><p>ProShop Stories</p></div>
                    <div><p>We Cares</p></div>
                    <div><p>Gift a Smile</p></div>
                </div>
                <div className="footer__column">
                    <div className="footer__heading">Connect with Us</div>
                    <div><p>Facebook</p></div>
                    <div><p>Twitter</p></div>
                    <div><p>Instagram</p></div>
                    <div><p>Reddit</p></div>
                    <div><p>Thumbler</p></div>
                    <div><p>Youtube</p></div>
                </div>
                <div className="footer__column">
                    <div className="footer__heading">Make Money with Us</div>
                    <div><p>Sell on ProShop</p></div>
                    <div><p>Sell under ProShop Accelerator</p></div>
                    <div><p>Become an Affiliate</p></div>
                    <div><p>Fulfilment by ProShop</p></div>
                    <div><p>Advertise Your Products</p></div>
                    <div><p>ProShop Pay on Merchants</p></div>

                </div>
                <div className="footer__column">
                    <div className="footer__heading">Let Us Help You</div>
                    <div><p>COVID-19 and ProShop</p></div>
                    <div><p>Returns Centre</p></div>
                    <div><p>100% Purchase Protection</p></div>
                    <div><p>ProShop App Download</p></div>
                    <div><p>ProShop Assistant Download</p></div>
                    <div><p>Help</p></div>
                </div>
                <div className="footer__column">
                    <div className="footer__heading">Download App</div>
                    <button><Shop/><span className="btn__text">Play Store</span></button>
                    <button><Apple/><span className="btn__text">App Store</span></button>
                </div>
            </div>

        );
    }
}

export default MainFooter;
