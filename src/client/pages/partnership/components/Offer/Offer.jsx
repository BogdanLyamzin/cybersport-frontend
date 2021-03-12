import React from "react";
import styles from "./Offer.module.scss"
import Heading from "../../../../../shared/components/Heading";
import EventList from "./componetns/EventList";
import {Formik, Field } from "formik";
import Button from "../../../../../shared/components/Button";
import {useState} from "react";
import {setStatus, setNewPartner} from "../../reducers/partnerReducer";
import {shallowEqual, useDispatch, useSelector} from "react-redux";


import partnerProfileProps from "../../partnerProfileProps";
import { changeDataRequestCreator } from '../../reducers/partnershipActionCreators';

const Offer = () => {
    const {link, src, srcSmall} = partnerProfileProps;
    const status = useSelector(({partners}) => partners.status, shallowEqual);
    const id = useSelector(({partners}) => partners.id, shallowEqual);
    const partners = useSelector(({partners}) => partners.partnersData, shallowEqual);
    const dispatch = useDispatch();
    const {sub, title} = partners;

    const eventsProps = ["1", "2", "3", "4", "5", "6", "7"];
    const [buttonStatus,setButtonStatus] = useState(true);
    const [acceptStatus,setAcceptStatus] = useState(false);
    const [buttonClass,setButtonClass] = useState("inactive");
    const [titlePartnerStatus, setTitlePartnerStatus] = useState(true);

    const checkTitle = (titlePartnerStatus) => titlePartnerStatus ? styles.active : "";
    const checkAccept = (acceptStatus) => !acceptStatus ? styles.hide : "";
    const switchOffer = () => {
        setTitlePartnerStatus(!titlePartnerStatus);
        dispatch(setStatus((status === "title") ? "sub" : "title"));
    }
    const switchAccept = () => {
        setAcceptStatus(!acceptStatus);
        let newTitle, newSub;
        if (status === "title")
        {
            newTitle = {
                link: link,
                src: src
            }
            newSub = [...sub];
        }
        else {
            newTitle = {...title};
            newSub = [...sub, {
                link: link,
                src: srcSmall
            }];
        }
        dispatch(changeDataRequestCreator(id, {partnersData: {sub : newSub, title : newTitle}} ))
    }

 return(
     <div className={styles.offer}>
         <Heading type={'block'} text='Partnership offer'/>
         <div className={styles.offerBase}>
             <h2>5x5 Tournaments</h2>
             <p className={styles.offerDescr}>I look like you wanna look, I fuck like you wanna fuck, I am smart, capable, and most importantly, I'm free in all the ways that you are not.
             </p>
             <div>
                 <div className={styles.offerPartner}>
                     <h3>Type of partnership</h3>
                         <div className={styles.partnerGroup}>
                             <div className={`${styles.partner} ${checkTitle(titlePartnerStatus)}`} onClick={switchOffer}>
                                 <h4>Title partner</h4>
                                 <p className={styles.banner}>Banner</p>
                                 <p className={styles.bannerSize}>250x250</p>
                             </div>
                             <div className={`${styles.partner} ${checkTitle(!titlePartnerStatus)}`} onClick={switchOffer}>
                                 <h4>Partner</h4>
                                 <p className={styles.banner}>Banner</p>
                                 <p className={styles.bannerSize}>250x120</p>
                             </div>
                         </div>
                 </div>
                 <div>
                     <h3>Tournaments list</h3>
                     <div>
                         <EventList eventsProps={eventsProps}/>
                     </div>
                 </div>

                 <div className={styles.dates}>
                     <div className={styles.datesTextItem}>
                         <span>start</span>
                         <span>01.12.2020</span>
                     </div>
                     <div className={styles.datesTextItem}>
                         <span>end</span>
                         <span>01.12.2021</span>
                     </div>
                 </div>
                 <div>
                     <Formik  initialValues={{toggle: false}} >

                             <label className={styles.termsCheck}>
                             <Field type="checkbox" name="toggle" onClick={() => {
                                 setButtonStatus(!buttonStatus);
                                 buttonClass === "inactive" ? setButtonClass("basic") : setButtonClass("inactive");
                                }
                             } />
                             Accept Terms and agreement
                         </label>

                     </Formik>

                 </div>

             </div>
         </div>
            <div className={`${styles.offerButtons} ${checkAccept(acceptStatus)}`}>
                <div className={styles.offerCost}>Partnership approved</div>
            </div>
             <div className={`${styles.offerButtons} ${checkAccept(!acceptStatus)}`}>
                 <div className={styles.offerCost}>
                     $1000
                 </div>
                 <div>

                     <Button
                         type={'button'}
                         classType={buttonClass}
                         additionalClass={styles.someButton}
                         text='Become partner'
                         disabled={buttonStatus}
                         handleClick={switchAccept}
                     />
                 </div>
             </div>
     </div>
 )
}

export default Offer
