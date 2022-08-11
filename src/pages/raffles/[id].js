import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Metadata from "../../components/Metadata";
import * as raffleStyles from "../../styles/Raffle.module.css";
// import raffleImg from "../../images/assets/pantha.webp";
import { HiTicket } from "react-icons/hi";
import { AiFillFire } from "react-icons/ai";
import { GiCrown } from "react-icons/gi";
import { FaTwitter, FaDiscord } from "react-icons/fa";
import { navigate } from "gatsby";
import Countdown from "react-countdown";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

import kongs from "../../images/assets/kongs.webp";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import { useEffect } from "react";

const winners = [
  {
    id: "1",
    wallet: "C9Azhh87saDj884qmcpKhiewN2doby47sKb4hXG3Z9x6	",
    entries: 3,
    claim: "no",
  },
  {
    id: "2",
    wallet: "C9Azhh87saDj884qmcpKhiewN2doby47sKb4hXG3Z9x6	",
    entries: 3,
    claim: "yes",
  },
  {
    id: "3",
    wallet: "C9Azhh87saDj884qmcpKhiewN2doby47sKb4hXG3Z9x6	",
    entries: 3,
    claim: "yes",
  },
  {
    id: "4",
    wallet: "C9Azhh87saDj884qmcpKhiewN2doby47sKb4hXG3Z9x6	",
    entries: 3,
    claim: "no",
  },
];

const RaffleDes = ({ params }) => {
  // states
  const [raffle, setRaffle] = useState({});
  const [nftConnect, setNftConnect] = useState(true);
  const [nfts, setNfts] = useState(3);
  const [countdown, setCountdown] = useState("");
  const [tickets, setTickets] = useState(1);
  const [walletAddress, setWalletAddress] = useState(
    "C9Azhh87saDj884qmcpKhiewN2doby47sKb4hXG3Z9x6"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  // get single doc from firebase
  const raffleCollection = collection(db, "raffles");

  useEffect(() => {
    const docRef = doc(raffleCollection, params.id);
    getDoc(docRef).then((doc) => {
      setRaffle({ ...doc.data(), id: doc.id });
    });
  }, [params.id]);

  const Completionist = () => <span> </span>;
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      setCountdown("over");
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span>
          Ends in: {days} D: {hours} H: {minutes} M: {seconds} S
        </span>
      );
    }
  };
  const handleOnclick = (id) => {
    navigate(`/raffles/${id}`);
  };

  const handleOnChange = (e) => {
    const newTickets = parseInt(e);
    // setTickets(e);
    if (nfts >= newTickets) {
      setTickets(newTickets);
    } else {
      setTickets(nfts);
    }
  };

  // save to database
  // wallet address, raffle id, tickets or entries

  const handleSubmit = async () => {
    setIsLoading(true);
    const newWallet = { walletAddress, tickets };
    const updateRaffle = doc(raffleCollection, raffle.id);
    await updateDoc(updateRaffle, {
      wallets: arrayUnion(newWallet),
    })
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // check entries
  useEffect(() => {
    let newTickets = 0;
    for (let i = 0; i < raffle.wallets?.length; i++) {
      const element = raffle.wallets[i];
      if (element?.walletAddress === walletAddress) {
        newTickets = newTickets + raffle.wallets[i].tickets;
        setNfts(nfts - newTickets);
      }
    }
  }, [walletAddress, raffle.wallets]);

  return (
    <>
      <Metadata
        titleTwitter="SpaceBudz: Collectible Astronauts"
        title="Raffle"
        description="Collect your unique SpaceBud as NFT on the Cardano blockchain."
      />{" "}
      {/* main content  */}{" "}
      <main>
        <Container maxW={"800px"} p={2} my={20}>
          {" "}
          {raffle.date > new Date() ? (
            <Box>
              <Flex
                justifyContent="center"
                gap={20}
                sx={{
                  my: 4,
                }}
              >
                <Text
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <HiTicket color="#30f100" /> Tickets sold: {raffle?.entries}{" "}
                </Text>{" "}
                <Text
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <AiFillFire color="#30f100" /> $IEN spent: 26640{" "}
                </Text>{" "}
                <Text
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <GiCrown color="#30f100" /> Unique wallets: 544{" "}
                </Text>{" "}
              </Flex>{" "}
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img width={200} src={raffle?.image} alt="" />
              </Box>{" "}
              <Box
                sx={{
                  my: 8,
                }}
              >
                <Heading
                  as="h3"
                  size={"md"}
                  sx={{
                    textAlign: "center",
                    my: 4,
                  }}
                >
                  {raffle.name}{" "}
                </Heading>{" "}
                {/* <Flex
                  justifyContent="center"
                  gap={2}
                  sx={{
                    my: 4,
                  }}
                >
                  <a href="http://" target="_blank" rel="noopener noreferrer">
                    <FaDiscord color="#30f100" />
                  </a>{" "}
                  <a href="http://" target="_blank" rel="noopener noreferrer">
                    <FaTwitter color="#30f100" />
                  </a>
                </Flex> */}
              </Box>
            </Box>
          )}{" "}
          <Box
            sx={{
              mt: 20,
            }}
            className={raffleStyles.singleRaffleBox}
          >
            {" "}
            {raffle.date > new Date() ? (
              <div>
                <Box
                  sx={{
                    my: 8,
                  }}
                >
                  <Heading
                    as="h3"
                    size={"md"}
                    sx={{
                      textAlign: "center",
                      my: 4,
                    }}
                  >
                    {raffle.name}{" "}
                  </Heading>{" "}
                  {/* <Flex
                    justifyContent="center"
                    gap={2}
                    sx={{
                      my: 4,
                    }}
                  >
                    <a href="http://" target="_blank" rel="noopener noreferrer">
                      <FaDiscord color="#30f100" />
                    </a>{" "}
                    <a href="http://" target="_blank" rel="noopener noreferrer">
                      <FaTwitter color="#30f100" />
                    </a>{" "}
                  </Flex>{" "} */}
                </Box>{" "}
                <Flex
                  gap={10}
                  sx={{
                    my: 4,
                    alignItems: "end",
                  }}
                >
                  <Box>
                    <img width={200} src={raffle.image} alt="" />
                  </Box>{" "}
                  <Box>
                    <Box
                      sx={{
                        my: 4,
                      }}
                    >
                      <Heading
                        as="h3"
                        size="md"
                        sx={{
                          my: 2,
                        }}
                      >
                        Winner(s){" "}
                      </Heading>{" "}
                      <Text as="span"> 1 </Text>{" "}
                    </Box>{" "}
                    <Box
                      sx={{
                        mt: 4,
                        mb: 8,
                      }}
                    >
                      <Heading
                        as="h3"
                        size="md"
                        sx={{
                          my: 2,
                        }}
                      >
                        Price{" "}
                      </Heading>
                      <Text as="span"> 1 NFT / ticket </Text>{" "}
                    </Box>{" "}
                    <Box>
                      {" "}
                      {/* <button className={raffleStyles.minusBtn}> - </button>
                              <input
                                className={raffleStyles.inputField}
                                type="number"
                                value={1}
                              />
                              <button className={raffleStyles.plusBtn}>+</button> */}{" "}
                      <NumberInput
                        onChange={handleOnChange}
                        defaultValue={tickets}
                        min={1}
                        max={nfts}
                        keepWithinRange={true}
                        clampValueOnBlur={false}
                      >
                        <NumberInputField className={raffleStyles.inputField} />{" "}
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>{" "}
                      </NumberInput>
                    </Box>{" "}
                  </Box>{" "}
                  <Box>
                    {/* <Box
                      sx={{
                        my: 4,
                      }}
                    >
                      <Heading
                        as="h3"
                        size="md"
                        sx={{
                          my: 2,
                        }}
                      >
                        Collection Size{" "}
                      </Heading>{" "}
                      <Text as="span"> 8888 </Text>{" "}
                    </Box>{" "} */}
                    <Box
                      sx={{
                        mt: 4,
                        mb: 8,
                      }}
                    >
                      <Heading
                        as="h3"
                        size="md"
                        sx={{
                          my: 2,
                        }}
                      >
                        Raffle Ends{" "}
                      </Heading>{" "}
                      <Box>
                        <Countdown date={raffle.date} renderer={renderer} />{" "}
                      </Box>{" "}
                    </Box>{" "}
                    {nfts <= tickets ? (
                      <Button disabled colorScheme="green">
                        You already have max entries
                      </Button>
                    ) : (
                      <>
                        {isLoading ? (
                          <Button
                            onClick={handleSubmit}
                            disabled={nftConnect ? false : true}
                            colorScheme="green"
                          >
                            <Spinner />
                          </Button>
                        ) : (
                          <Button
                            onClick={handleSubmit}
                            disabled={nftConnect ? false : true}
                            colorScheme="green"
                          >
                            {nftConnect
                              ? `Buy ${tickets} ticket(s)`
                              : `Connect your wallet`}
                          </Button>
                        )}
                      </>
                    )}
                  </Box>{" "}
                </Flex>{" "}
                {nfts <= tickets && (
                  <Text sx={{ textAlign: "center" }}>
                    You have only {nfts} NFTs available{" "}
                  </Text>
                )}
              </div>
            ) : (
              <div>
                <TableContainer>
                  <Table colorScheme="green" variant="unstyled">
                    <Thead>
                      <Tr>
                        <Th> Wallet </Th> <Th> Entries </Th> <Th> Claim </Th>{" "}
                      </Tr>{" "}
                    </Thead>{" "}
                    <Tbody>
                      {" "}
                      {winners.map((winner) => (
                        <Tr key={winner.id}>
                          <Td> {winner.wallet} </Td> <Td> {raffle.entries} </Td>{" "}
                          <Td>
                            {" "}
                            {winner.claim === "yes" ? (
                              <Text color="#30f100"> Claimed </Text>
                            ) : (
                              ""
                            )}{" "}
                          </Td>{" "}
                        </Tr>
                      ))}{" "}
                    </Tbody>{" "}
                  </Table>{" "}
                </TableContainer>{" "}
              </div>
            )}{" "}
          </Box>{" "}
        </Container>{" "}
      </main>{" "}
    </>
  );
};

export default RaffleDes;
