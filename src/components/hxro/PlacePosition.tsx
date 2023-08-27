import {
	Keypair,
	Connection,
} from '@solana/web3.js';
import { FC } from 'react';
import {
	ParimutuelWeb3,
	PositionSideEnum,
	DEV_CONFIG,
  MarketPairEnum,
  getMarketPubkeys,
} from '@hxronetwork/parimutuelsdk';
import { Linking, View } from 'react-native';
import { Button, Text } from '@rneui/base';
import tw from 'twrnc';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Pressable } from 'react-native';

const privateKey = new Uint8Array([
	70, 224, 61, 154, 54, 252, 229, 243, 14, 140, 229, 12, 152, 220, 123, 254,
	160, 164, 44, 131, 155, 20, 10, 108, 71, 159, 52, 200, 0, 195, 70, 196, 55,
	241, 189, 60, 16, 218, 175, 228, 209, 161, 98, 24, 156, 247, 94, 213, 185,
	178, 35, 219, 110, 4, 218, 61, 156, 48, 136, 242, 160, 191, 140, 211,
]);
const keypair = Keypair.fromSecretKey(privateKey);

const config = DEV_CONFIG;
const rpc =
	'https://devnet.helius-rpc.com/?api-key=6c8d6b2d-d450-40ae-8f14-06e093253afc';
const connection = new Connection(rpc, 'confirmed');

const parimutuelWeb3 = new ParimutuelWeb3(config, connection);

const market = MarketPairEnum.BTCUSD;
const marketPubkeys = getMarketPubkeys(config, market);
const marketTerm = 60;
const selectedMarket = marketPubkeys.filter(
	(market) => market.duration === marketTerm
);

const usdcDec = 100_000_00;

const PlacePosition: FC<{pariPubkey: string, side: PositionSideEnum, amount: string}> = (props) => {
    const { side, amount} = props

    const [txHash, setTxHash] = useState('');

    const [modalVisible, setModalVisible] = useState(false);

    const placePosition = async () => {
			const parimutuels = await parimutuelWeb3.getParimutuels(selectedMarket);

			const pariContest = parimutuels.filter(
				(pari) =>
					pari.info.parimutuel.timeWindowStart.toNumber() > Date.now() &&
					pari.info.parimutuel.timeWindowStart.toNumber() <
						Date.now() + marketTerm * 1000
			);

			const contestPubkey = pariContest[0].pubkey;
			

			await parimutuelWeb3.placePosition(
				keypair as Keypair,
				contestPubkey,
				Number(amount) * usdcDec,
				side,
				Date.now()
			).then(
				(res) => {
          setTxHash(res);
          console.log('txHash: ', res);
          setModalVisible(!modalVisible);
				}
			)
		};
      
    const bgGradientClass =
    side === PositionSideEnum.LONG
      ? 'bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-teal-500 hover:to-indigo-500'
      : 'bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-yellow-500 hover:to-pink-500';


    return (
			<View style={{ width: 360, height: 60 }}>
				<Button
					title={side === PositionSideEnum.LONG ? 'Win' : 'Lose'}
					color={side === PositionSideEnum.LONG ? 'blue' : 'red'}
					onPress={() => placePosition()}
					style={{ borderRadius: 120 }}
				>
					<View
						style={tw`group rounded-full w-60 m-2 btn disabled:animate-none bg-gradient-to-r ${bgGradientClass} ...`}
					>
						<Text style={tw`block text-white`}>
							{side === PositionSideEnum.LONG ? 'SKT Win' : 'SKT Lose'}
						</Text>
						<Text style={tw`block group-disabled:hidden text-white`}>
							{amount} USDC
						</Text>
					</View>
				</Button>

				<View style={styles.centeredView}>
					<Modal
						animationType="slide"
						transparent={true}
						visible={modalVisible}
						onRequestClose={() => {
							Alert.alert('Modal has been closed.');
							setModalVisible(!modalVisible);
						}}
					>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<Text style={styles.modalText}>
									{'Transaction Successful! '}
									<Text
										style={{ color: 'blue' }}
										onPress={() =>
											Linking.openURL(
												`https://explorer.solana.com/tx/${txHash}?cluster=devnet`
											)
										}
									>
										click me 👈
									</Text>
								</Text>
								<Pressable
									style={[styles.button, styles.buttonClose]}
									onPress={() => setModalVisible(!modalVisible)}
								>
									<Text style={styles.textStyle}>Yep!</Text>
								</Pressable>
							</View>
						</View>
					</Modal>
				</View>
			</View>
		);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	buttonClose: {
		backgroundColor: '#2196F3',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
});


export default PlacePosition;
