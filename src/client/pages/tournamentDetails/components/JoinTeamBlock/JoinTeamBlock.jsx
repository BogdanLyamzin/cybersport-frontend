import React, {useEffect} from 'react';
import { v4 } from 'uuid';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { ReactComponent as Lightening } from '../../../../../assets/icons/lightening.svg';
import Button from '../../../../../shared/components/Button';
import {
    setTournamentOwnerTeam, toggleJoinSoloStatus, toggleInviteModal,
    toggleJoinTeamStatus, setTournamentSoloTeam,
} from '../../reducers/tournamentDetailsReducer';
import { setBalance } from '../../../../navbar/reducer/authReducer';

import styles from './JoinTeamBlock.module.scss';

import { randomPlayersData } from '../../randomPlayersData'; //logic rethink needed after back-end fully operational

const JoinTeamBlock = () => {
    const dispatch = useDispatch();
    const {teamAvatarImg, name} = useSelector(({auth}) => auth.teamData, shallowEqual);
    const {entry} = useSelector(({tournamentDetails}) => tournamentDetails.processedTournamentData, shallowEqual);
    const {id, smallAvatarImg, mediumAvatarImg, accountBalance} = useSelector(({auth}) => auth.userData, shallowEqual);
    const {team} = useSelector(({tournamentDetails}) => tournamentDetails.discount, shallowEqual);
    const tournamentOwnerTeam = useSelector(({tournamentDetails}) => tournamentDetails.tournamentOwnerTeam, shallowEqual);
    const {notReady, ready, joined, confirmed, disabled} = useSelector(({tournamentDetails}) => tournamentDetails.joinTeamStatus, shallowEqual);
    const discountedEntry = entry - entry*team/100;
    const headingText = notReady || ready || disabled ? 'Join with your team' : 'As team';
    const teamStatusText = notReady || disabled ? 'Need to invite teammates' : 'Team ready to start playing';
    const additionalClass = disabled || notReady ? styles.join_button_disabled : styles.join_button;

    useEffect(() => {
        if (tournamentOwnerTeam.length === 0 && id) {
            const owner = {
                id: id,
                smallAvatarImg: smallAvatarImg,
                mediumAvatarImg: mediumAvatarImg,
                owner: true
            };
            const createdTournamentTeam = [...tournamentOwnerTeam];
            createdTournamentTeam.push(owner);
            dispatch(setTournamentOwnerTeam(createdTournamentTeam));
        }
    });

    const addRandomPlayers = (team) => {
        if (team.length < 5) {
            const randomTournamentTeam = [...team];
            const randomPlayers = [...randomPlayersData];
            const randomIndex = () => Math.floor(Math.random()*(randomPlayers.length));
            do {
                randomTournamentTeam.push(randomPlayers.splice(randomIndex(), 1)[0]);
            } while (randomTournamentTeam.length < 5);
            dispatch(setTournamentOwnerTeam(randomTournamentTeam));
        }
    }

    const tournamentTeamList = tournamentOwnerTeam.map(({smallAvatarImg}) =>
        <div className={styles.join__team_item} key={v4()}>
            <img className={styles.small_avatar} src={smallAvatarImg} alt="small avatar" />
        </div>);

    return (
        <div className={styles.join__container}>
            <div className={styles.join__card}>
                <h4 className={styles.join__heading}>{headingText}</h4>
                <p className={styles.join__desription}
                   style={{ marginBottom: '10px' }}>{teamStatusText}</p>
                <div style={{ display: 'flex' }}>
                    <div style={{ marginRight: '15px' }}>
                        <img className={styles.user_img} src={teamAvatarImg}
                             alt="team avatar"/>
                        {(notReady || ready || joined || disabled) &&
                        <div style={{ textAlign: 'center' }}>
                            <Lightening/>
                            <span
                                className={styles.join__entry}>{discountedEntry}</span>
                        </div>}
                    </div>
                    <div>
                        <p className={styles.join__username}>{name}</p>
                        <p className={styles.join__desription}>You’ll get 30% of
                            prize</p>
                        <div style={{ marginBottom: '10px' }}>
                            {tournamentTeamList}
                        </div>
                        <div className={styles.btn_container}>
                            {(tournamentOwnerTeam.length < 5 && (notReady || ready)) &&
                            <Button
                                text={`+ ${5-tournamentOwnerTeam.length} players`}
                                classType='outline'
                                additionalClass={styles.btn_addplayers}
                                handleClick={() => {
                                    dispatch(toggleInviteModal())
                                }}
                            />}
                        </div>
                        {(notReady || ready || disabled) &&
                        <div style={{ textAlign: 'center', display: 'inline-block' }}>
                            <Button
                                text='JOIN'
                                classType='basic'
                                additionalClass={additionalClass}
                                disabled={disabled || notReady}
                                handleClick={() => {
                                    addRandomPlayers(tournamentOwnerTeam);
                                    dispatch(toggleJoinTeamStatus('joined'));
                                    dispatch(toggleJoinSoloStatus('disabled'));
                                }}
                            />
                            <span className={styles.join__desription}>{`Save ${team}%`}</span>
                        </div>}
                        {joined && <div>
                            <Button
                                text='CONFIRM'
                                classType='basic'
                                additionalClass={styles.btn_confirm}
                                handleClick={() => {
                                    dispatch(toggleJoinTeamStatus('confirmed'));
                                    const currentBalance = accountBalance - discountedEntry;
                                    dispatch(setBalance(currentBalance.toString()));
                                }}
                            />
                            <Button
                                text='CANCEL'
                                classType='basic'
                                additionalClass={styles.btn_cancel}
                                handleClick={() => {
                                    dispatch(toggleJoinTeamStatus('notReady'));
                                    dispatch(toggleJoinSoloStatus('ready'));
                                    dispatch(setTournamentOwnerTeam([]));
                                }}
                            />
                        </div>}
                        {confirmed &&
                        <div className={styles.join__confirmed}>
                            <span>GO TO DOTA 2 CLIENT</span>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinTeamBlock;
