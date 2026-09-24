import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const C = {
  primary: '#0f766e',
  dark: '#115e59',
  background: '#f5f7f8',
  white: '#ffffff',
  text: '#17202a',
  muted: '#64748b',
  border: '#dbe4e8',
  mint: '#ccfbf1',
  navy: '#102a43',
  danger: '#b91c1c',
};

const categories = [
  'Artisans',
  'Manœuvres',
  'Techniciens BTP',
  'Sociétés BT/BTP',
  'Transporteurs',
  'Conducteurs d’engins',
  'Matériaux et équipements',
  'Engins de chantier',
  'Terrains',
  'Maisons, immeubles et bureaux',
  'Logement express',
];

const machinery = [
  'Bulldozer',
  'Pelleteuse / excavatrice',
  'Pelle hydraulique',
  'Chargeuse',
  'Tombereau / dumper',
  'Décapeuse / scraper',
  'Trancheuse',
  'Compacteur / rouleau',
  'Niveleuse / grader',
  'Vibreur à plaque',
  'Pilonneuse / dameuse',
  'Grue à tour',
  'Grue mobile',
  'Chariot élévateur / Manitou',
  'Nacelle / plateforme',
  'Bétonnière',
  'Centrale à béton',
  'Pompe à béton',
  'Foreuse / tarière',
  'Sondeuse',
  'Compresseur d’air',
  'Lisseuse à béton',
];

function Header({ title, onBack }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>‹</Text>
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.backButton} />
    </View>
  );
}

function Button({ title, onPress, secondary = false }) {
  return (
    <Pressable onPress={onPress} style={[styles.button, secondary && styles.secondaryButton]}>
      <Text style={[styles.buttonText, secondary && styles.secondaryButtonText]}>{title}</Text>
    </Pressable>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType, secureTextEntry, multiline }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        placeholderTextColor={C.muted}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        style={[styles.input, multiline && styles.multiline]}
      />
    </View>
  );
}

function TableHeader({ labels }) {
  return (
    <View style={styles.tableRow}>
      {labels.map((label) => (
        <Text key={label} style={styles.cellHeader}>{label}</Text>
      ))}
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('Artisans');
  const [chatText, setChatText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [quoteRows, setQuoteRows] = useState([{ designation: '', quantity: '', unit: '' }]);
  const [labourRows, setLabourRows] = useState([{ designation: '', quantity: '', price: '' }]);
  const [paymentRows, setPaymentRows] = useState([{ name: '', amount: '' }]);
  const [cardCreatedAt, setCardCreatedAt] = useState(null);
  const [operator, setOperator] = useState('');

  const go = (nextScreen) => setScreen(nextScreen);
  const back = () => setScreen('home');

  const sendChat = () => {
    const trimmed = chatText.trim();
    if (!trimmed) return;
    setChatMessages((items) => [...items, trimmed]);
    setChatText('');
  };

  const expiresAt = useMemo(() => {
    if (!cardCreatedAt) return null;
    return cardCreatedAt + 5 * 60 * 1000;
  }, [cardCreatedAt]);

  const renderScreen = () => {
    if (screen === 'home') return <Home go={go} setSelectedCategory={setSelectedCategory} />;
    if (screen === 'search') return <Search category={selectedCategory} go={go} />;
    if (screen === 'chat') return <Chat go={go} messages={chatMessages} text={chatText} setText={setChatText} send={sendChat} />;
    if (screen === 'attachments') return <Attachments go={go} />;
    if (screen === 'location') return <LocationScreen back={back} />;
    if (screen === 'document') return <DocumentScreen back={back} />;
    if (screen === 'quote') return <QuoteScreen back={back} rows={quoteRows} setRows={setQuoteRows} labour={labourRows} setLabour={setLabourRows} />;
    if (screen === 'paymentCard') return <PaymentCard rows={paymentRows} setRows={setPaymentRows} createdAt={cardCreatedAt} expiresAt={expiresAt} onGenerate={() => setCardCreatedAt(Date.now())} go={go} />;
    if (screen === 'payConfirm') return <PayConfirm go={go} />;
    if (screen === 'paySuccess') return <Success title="Félicitations !" message="Vous avez payé avec succès !" back={back} />;
    if (screen === 'cash') return <Cash go={go} />;
    if (screen === 'recharge') return <Recharge operator={operator} setOperator={setOperator} go={go} />;
    if (screen === 'operatorCode') return <OperatorCode go={go} />;
    if (screen === 'ppcSecret') return <PpcSecret go={go} success="recharge" />;
    if (screen === 'rechargeSuccess') return <Success title="Félicitations !" message="La recharge de votre compte PPC-Cash a réussi." back={back} />;
    if (screen === 'withdraw') return <Withdrawal operator={operator} setOperator={setOperator} go={go} />;
    if (screen === 'withdrawSummary') return <WithdrawalSummary operator={operator} go={go} />;
    if (screen === 'withdrawSuccess') return <Success title="Félicitations !" message={`Vous venez de retirer : … FCFA vers ${operator}.`} back={back} />;
    if (screen === 'publish') return <Publish back={back} />;
    if (screen === 'profile') return <Profile back={back} />;
    return <Home go={go} setSelectedCategory={setSelectedCategory} />;
  };

  const showNav = ['home', 'chat', 'cash', 'publish', 'profile'].includes(screen);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.app}>{renderScreen()}</View>
      {showNav && <BottomNav active={screen} go={go} />}
    </SafeAreaView>
  );
}

function BottomNav({ active, go }) {
  const tabs = [
    ['home', '⌂', 'Accueil'],
    ['chat', '💬', 'Discussion'],
    ['cash', '₣', 'PPC-Cash'],
    ['publish', '+', 'Publier'],
    ['profile', '♙', 'Profil'],
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map(([key, icon, label]) => (
        <Pressable key={key} onPress={() => go(key)} style={styles.navItem}>
          <Text style={styles.navIcon}>{icon}</Text>
          <Text style={[styles.navLabel, active === key && styles.activeLabel]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function Home({ go, setSelectedCategory }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.homeTitle}>
        <Text style={styles.brand}>Artisans Togo</Text>
      </View>
      <Text style={styles.intro}>La plateforme qui vous accompagne.</Text>
      <Text style={styles.sectionTitle}>Services</Text>
      {categories.map((category) => (
        <Pressable
          key={category}
          style={styles.menuRow}
          onPress={() => {
            setSelectedCategory(category);
            go('search');
          }}
        >
          <Text style={styles.menuText}>{category}</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function Search({ category, go }) {
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const isMachinery = category === 'Conducteurs d’engins';

  return (
    <View style={styles.screen}>
      <Header title={category} onBack={() => go('home')} />
      <ScrollView contentContainerStyle={styles.content}>
        {isMachinery ? (
          <>
            <Text style={styles.sectionTitle}>Choisir une ou plusieurs catégories</Text>
            {machinery.map((item) => (
              <Text key={item} style={styles.checkRow}>□ {item}</Text>
            ))}
          </>
        ) : (
          <>
            <Field label="Ville" value={city} onChangeText={setCity} />
            <Field label="Quartier" value={district} onChangeText={setDistrict} />
          </>
        )}
        <Button title="Valider" onPress={() => Alert.alert('Recherche', 'La recherche sera affichée après connexion à Firebase.')} />
      </ScrollView>
    </View>
  );
}

function Chat({ go, messages, text, setText, send }) {
  return (
    <View style={styles.screen}>
      <Header title="Discussion" onBack={() => go('home')} />
      <ScrollView contentContainerStyle={styles.chatList}>
        {messages.map((item, index) => (
          <View key={`${item}-${index}`} style={[styles.bubble, index % 2 === 0 && styles.myBubble]}>
            <Text>{item}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.composer}>
        <Pressable onPress={() => go('attachments')}>
          <Text style={styles.attach}>📎</Text>
        </Pressable>
        <Pressable onPress={() => Alert.alert('Caméra', 'La caméra sera connectée dans le module média.')}>
          <Text style={styles.attach}>📷</Text>
        </Pressable>
        <TextInput value={text} onChangeText={setText} placeholder="Écrire un message" style={styles.messageInput} />
        <Pressable onPress={send} style={styles.roundButton}>
          <Text style={styles.roundText}>{text.trim() ? '➤' : '🎤'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Attachments({ go }) {
  const choices = [
    ['Galerie', '🖼️'],
    ['Caméra', '📷'],
    ['Localisation', '📍'],
    ['Document', '📄'],
    ['Devis', '🧾'],
    ['Carte paiement PPC-Cash', '₣'],
  ];

  return (
    <View style={styles.screen}>
      <Header title="Ajouter" onBack={() => go('chat')} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.attachmentGrid}>
          {choices.map(([label, icon]) => (
            <Pressable
              key={label}
              style={styles.attachment}
              onPress={() => {
                if (label === 'Localisation') go('location');
                else if (label === 'Document') go('document');
                else if (label === 'Devis') go('quote');
                else if (label === 'Carte paiement PPC-Cash') go('paymentCard');
                else Alert.alert(label, 'Cette sélection sera connectée au module correspondant.');
              }}
            >
              <Text style={styles.attachmentIcon}>{icon}</Text>
              <Text style={styles.attachmentLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function LocationScreen({ back }) {
  return (
    <View style={styles.screen}>
      <Header title="Localisation" onBack={back} />
      <View style={styles.content}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>Carte</Text>
        </View>
        <Button title="Envoyer votre localisation actuelle" onPress={() => Alert.alert('Localisation', 'Votre localisation sera envoyée après autorisation.')} />
      </View>
    </View>
  );
}

function DocumentScreen({ back }) {
  return (
    <View style={styles.screen}>
      <Header title="Document" onBack={back} />
      <View style={styles.content}>
        <View style={styles.empty}>
          <Text>Aucun document sélectionné.</Text>
        </View>
        <Button title="Envoyer" onPress={() => Alert.alert('Document', 'Sélectionnez un document avant de l’envoyer.')} />
      </View>
    </View>
  );
}

function QuoteScreen({ back, rows, setRows, labour, setLabour }) {
  const update = (setter, list, index, key, value) => {
    setter(list.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  };

  return (
    <View style={styles.screen}>
      <Header title="Artisans Togo · Devis" onBack={back} />
      <ScrollView contentContainerStyle={styles.content}>
        <Field label="Niveau des travaux" />

        <Text style={styles.tableTitle}>Matériaux nécessaires</Text>
        <TableHeader labels={['Désignation matériaux', 'Quantité', 'Unité']} />
        {rows.map((row, i) => (
          <View style={styles.tableRow} key={i}>
            <TextInput style={styles.cell} value={row.designation} onChangeText={(v) => update(setRows, rows, i, 'designation', v)} />
            <TextInput style={styles.cell} value={row.quantity} onChangeText={(v) => update(setRows, rows, i, 'quantity', v)} />
            <TextInput style={styles.cell} value={row.unit} onChangeText={(v) => update(setRows, rows, i, 'unit', v)} />
          </View>
        ))}
        <Button title="Ajouter une ligne" secondary onPress={() => setRows([...rows, { designation: '', quantity: '', unit: '' }])} />

        <Text style={styles.tableTitle}>Main d’œuvre</Text>
        <TableHeader labels={['Désignation des travaux', 'Quantité', 'Prix unitaire M.O.']} />
        {labour.map((row, i) => (
          <View style={styles.tableRow} key={i}>
            <TextInput style={styles.cell} value={row.designation} onChangeText={(v) => update(setLabour, labour, i, 'designation', v)} />
            <TextInput style={styles.cell} value={row.quantity} onChangeText={(v) => update(setLabour, labour, i, 'quantity', v)} />
            <TextInput style={styles.cell} value={row.price} onChangeText={(v) => update(setLabour, labour, i, 'price', v)} />
          </View>
        ))}
        <Button title="Ajouter une ligne" secondary onPress={() => setLabour([...labour, { designation: '', quantity: '', price: '' }])} />

        <Text style={styles.total}>Total : calculé automatiquement</Text>
        <Button title="Accepter le devis" onPress={() => Alert.alert('Devis', 'Le devis accepté sera envoyé au client.')} />
        <Button title="Refuser" secondary onPress={back} />
      </ScrollView>
    </View>
  );
}

function PaymentCard({ rows, setRows, createdAt, expiresAt, onGenerate, go }) {
  const expired = expiresAt && Date.now() >= expiresAt;
  const add = () => setRows([...rows, { name: '', amount: '' }]);

  return (
    <View style={styles.screen}>
      <Header title="Carte paiement PPC-Cash" onBack={() => go('chat')} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.info}>Reçu généré à partir des articles ou du devis.</Text>

        {rows.map((row, i) => (
          <View style={styles.paymentRow} key={i}>
            <TextInput
              style={[styles.input, styles.flex]}
              placeholder="Nom de l’article"
              value={row.name}
              onChangeText={(v) => setRows(rows.map((r, n) => (n === i ? { ...r, name: v } : r)))}
            />
            <TextInput
              style={styles.amountInput}
              placeholder="Prix"
              keyboardType="numeric"
              value={row.amount}
              onChangeText={(v) => setRows(rows.map((r, n) => (n === i ? { ...r, amount: v } : r)))}
            />
          </View>
        ))}

        <Button title="Ajouter un article" secondary onPress={add} />
        <Text style={styles.total}>Total à payer : à calculer</Text>

        {createdAt && !expired ? (
          <View style={styles.qr}>
            <Text style={styles.qrText}>QR CODE PPC-CASH</Text>
            <Text>Valable 5 minutes</Text>
          </View>
        ) : createdAt && expired ? (
          <Text style={styles.error}>Cette carte de paiement PPC-Cash a expiré.</Text>
        ) : null}

        <Button title="Générer" onPress={onGenerate} />
        {createdAt && !expired && (
          <Button title="Cliquer pour payer par PPC-Cash" secondary onPress={() => go('payConfirm')} />
        )}
      </ScrollView>
    </View>
  );
}

function PayConfirm({ go }) {
  return (
    <View style={styles.screen}>
      <Header title="Confirmation du paiement" onBack={() => go('paymentCard')} />
      <View style={styles.content}>
        <Text style={styles.summary}>Vous allez payer la facture de : … FCFA à …</Text>
        <Field label="Confirmer le paiement par votre code secret PPC-Cash" secureTextEntry />
        <Button title="Envoyer" onPress={() => go('paySuccess')} />
      </View>
    </View>
  );
}

function Success({ title, message, back }) {
  return (
    <View style={styles.screen}>
      <Header title={title} onBack={back} />
      <View style={styles.success}>
        <Text style={styles.successTitle}>{title}</Text>
        <Text style={styles.successMessage}>{message}</Text>
      </View>
    </View>
  );
}

function Cash({ go }) {
  return (
    <View style={styles.screen}>
      <Header title="PPC-Cash" onBack={() => go('home')} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.balanceLabel}>Solde PPC-Cash</Text>
        <Text style={styles.balance}>— FCFA</Text>
        <Button title="Recharger PPC-Cash" onPress={() => go('recharge')} />
        <Button title="Payer / Transférer" onPress={() => go('paymentCard')} />
        <Button title="Retirer de l’argent" onPress={() => go('withdraw')} />
      </ScrollView>
    </View>
  );
}

function Recharge({ operator, setOperator, go }) {
  return (
    <View style={styles.screen}>
      <Header title="Recharger PPC-Cash" onBack={() => go('cash')} />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Choisir</Text>
        {['Mixx de Yas', 'Moov Money de Moov Africa'].map((item) => (
          <Pressable key={item} onPress={() => setOperator(item)} style={[styles.menuRow, operator === item && styles.selectedRow]}>
            <Text style={styles.menuText}>{item}</Text>
          </Pressable>
        ))}
        <Field label="Numéro de téléphone" />
        <Field label="Montant" keyboardType="numeric" />
        <Button title="Envoyer" onPress={() => (operator ? go('operatorCode') : Alert.alert('Erreur', 'Choisissez un opérateur.'))} />
      </View>
    </View>
  );
}

function OperatorCode({ go }) {
  return (
    <View style={styles.screen}>
      <Header title="Code opérateur" onBack={() => go('recharge')} />
      <View style={styles.content}>
        <Field label="Code Mixx ou code Moov Money" secureTextEntry />
        <Button title="Envoyer" onPress={() => go('ppcSecret')} />
      </View>
    </View>
  );
}

function PpcSecret({ go, success }) {
  return (
    <View style={styles.screen}>
      <Header title="Confirmation" onBack={() => go(success === 'recharge' ? 'operatorCode' : 'withdrawSummary')} />
      <View style={styles.content}>
        <Text style={styles.summary}>Saisir le code secret PPC-Cash pour confirmer :</Text>
        <Field label="Code secret PPC-Cash" secureTextEntry />
        <Button title="Envoyer" onPress={() => go(success === 'recharge' ? 'rechargeSuccess' : 'withdrawSuccess')} />
      </View>
    </View>
  );
}

function Withdrawal({ operator, setOperator, go }) {
  return (
    <View style={styles.screen}>
      <Header title="Retrait d’argent" onBack={() => go('cash')} />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Retirer vers</Text>
        {['Mixx', 'Moov Money'].map((item) => (
          <Pressable key={item} onPress={() => setOperator(item)} style={[styles.menuRow, operator === item && styles.selectedRow]}>
            <Text style={styles.menuText}>{item}</Text>
          </Pressable>
        ))}
        <Field label="Numéro de téléphone" />
        <Field label="Montant" keyboardType="numeric" />
        <Button title="Envoyer" onPress={() => (operator ? go('withdrawSummary') : Alert.alert('Erreur', 'Choisissez un service.'))} />
      </View>
    </View>
  );
}

function WithdrawalSummary({ operator, go }) {
  return (
    <View style={styles.screen}>
      <Header title="Résumé de l’opération" onBack={() => go('withdraw')} />
      <View style={styles.content}>
        <Text style={styles.summary}>Vous voulez retirer … FCFA par {operator}.</Text>
        <Text style={styles.summary}>Entrez votre code secret PPC-Cash pour confirmer.</Text>
        <Button title="Continuer" onPress={() => go('ppcSecret')} />
      </View>
    </View>
  );
}

function Publish({ back }) {
  return (
    <View style={styles.screen}>
      <Header title="Publier" onBack={back} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.info}>Déposer vos articles ici</Text>
        <Field label="Nom" />
        <Field label="Prix" keyboardType="numeric" />
        <Field label="Description" multiline />
        <Field label="Ville" />
        <Field label="Quartier" />
        <Button title="Utiliser ma position" secondary onPress={() => Alert.alert('Localisation', 'Autorisation de localisation requise.')} />
        <Button title="Envoyer" onPress={() => Alert.alert('Publication', 'La publication sera enregistrée avec Firebase.')} />
      </ScrollView>
    </View>
  );
}

function Profile({ back }) {
  return (
    <View style={styles.screen}>
      <Header title="Profil" onBack={back} />
      <ScrollView contentContainerStyle={styles.content}>
        {['Mon compte Artisans Togo', 'Parrainage', 'À propos d’Artisans Togo', 'Déconnexion'].map((item) => (
          <Pressable key={item} style={styles.menuRow}>
            <Text style={styles.menuText}>{item}</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.primary },
  app: { flex: 1, backgroundColor: C.background },
  screen: { flex: 1, backgroundColor: C.background },
  content: { padding: 18, paddingBottom: 30 },
  header: { height: 64, backgroundColor: C.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { flex: 1, color: C.white, fontSize: 19, fontWeight: '800', textAlign: 'center' },
  backButton: { width: 34 },
  backText: { color: C.white, fontSize: 34, lineHeight: 34 },
  homeTitle: { backgroundColor: C.primary, padding: 24, borderRadius: 18 },
  brand: { color: C.white, fontSize: 30, fontWeight: '900' },
  intro: { color: C.muted, marginVertical: 18 },
  sectionTitle: { color: C.text, fontSize: 19, fontWeight: '800', marginBottom: 12 },
  menuRow: { backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 16, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },
  selectedRow: { backgroundColor: C.mint, borderColor: C.primary },
  menuText: { color: C.text, fontWeight: '700' },
  chevron: { color: C.primary, fontSize: 22 },
  field: { marginBottom: 14 },
  label: { color: C.text, fontWeight: '700', marginBottom: 7 },
  input: { backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 12, color: C.text },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  button: { backgroundColor: C.primary, borderRadius: 11, padding: 14, alignItems: 'center', marginTop: 10 },
  buttonText: { color: C.white, fontWeight: '800' },
  secondaryButton: { backgroundColor: C.mint },
  secondaryButtonText: { color: C.dark },
  balanceLabel: { color: C.muted, marginTop: 20 },
  balance: { color: C.navy, fontSize: 30, fontWeight: '900', marginBottom: 22 },
  chatList: { padding: 18, paddingBottom: 100 },
  bubble: { maxWidth: '80%', backgroundColor: C.white, borderRadius: 16, padding: 12, marginBottom: 10, alignSelf: 'flex-start' },
  myBubble: { backgroundColor: C.mint, alignSelf: 'flex-end' },
  composer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 9, backgroundColor: C.white, borderTopWidth: 1, borderColor: C.border, flexDirection: 'row', alignItems: 'center', gap: 7 },
  attach: { fontSize: 22 },
  messageInput: { flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 10 },
  roundButton: { width: 43, height: 43, borderRadius: 22, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  roundText: { color: C.white, fontSize: 18 },
  attachmentGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  attachment: { width: '48%', backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 18, marginBottom: 12, alignItems: 'center' },
  attachmentIcon: { fontSize: 27, marginBottom: 8 },
  attachmentLabel: { color: C.text, fontWeight: '700', textAlign: 'center' },
  mapPlaceholder: { height: 350, borderRadius: 15, backgroundColor: '#d9f2ef', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  mapText: { color: C.primary, fontWeight: '800' },
  empty: { padding: 35, alignItems: 'center', backgroundColor: C.white, borderRadius: 14 },
  tableTitle: { fontSize: 16, fontWeight: '800', marginVertical: 12 },
  tableRow: { flexDirection: 'row', borderWidth: 1, borderColor: C.border, backgroundColor: C.white },
  cellHeader: { flex: 1, padding: 7, fontSize: 11, fontWeight: '800' },
  cell: { flex: 1, minHeight: 44, padding: 7, borderRightWidth: 1, borderColor: C.border },
  total: { fontSize: 17, fontWeight: '900', marginVertical: 18 },
  info: { color: C.muted, marginBottom: 14 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  flex: { flex: 1 },
  amountInput: { width: 100, backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 12 },
  qr: { alignItems: 'center', backgroundColor: C.mint, borderRadius: 14, padding: 28, marginVertical: 18 },
  qrText: { color: C.primary, fontSize: 20, fontWeight: '900', marginBottom: 8 },
  error: { color: C.danger, fontWeight: '700', marginVertical: 18 },
  summary: { color: C.text, fontSize: 16, lineHeight: 25, marginBottom: 15 },
  success: { margin: 18, padding: 24, backgroundColor: C.white, borderRadius: 16 },
  successTitle: { color: C.primary, fontSize: 22, fontWeight: '900', marginBottom: 12 },
  successMessage: { color: C.text, fontSize: 16 },
  checkRow: { backgroundColor: C.white, padding: 12, borderBottomWidth: 1, borderColor: C.border },
  bottomNav: { height: 70, backgroundColor: C.white, borderTopWidth: 1, borderColor: C.border, flexDirection: 'row' },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIcon: { fontSize: 21 },
  navLabel: { color: C.muted, fontSize: 10, marginTop: 2 },
  activeLabel: { color: C.primary, fontWeight: '800' },
});
