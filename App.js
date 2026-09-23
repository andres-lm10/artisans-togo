import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';

const COLORS = {
  primary: '#0f766e',
  primaryDark: '#115e59',
  mint: '#ccfbf1',
  background: '#f5f7f8',
  surface: '#ffffff',
  text: '#17202a',
  muted: '#64748b',
  border: '#e2e8f0',
  navy: '#102a43',
};

const SERVICES = [
  ['🧱', 'Artisans', 'Trouvez un professionnel fiable'],
  ['👷', 'Manœuvres', 'Des équipes pour vos chantiers'],
  ['🔧', 'Techniciens BTP', 'Génie civil et topographie'],
  ['🏢', 'Sociétés BTP', 'Réalisez vos projets'],
  ['🚚', 'Transporteurs', 'Matériaux et équipements'],
  ['🚜', 'Conducteurs d’engins', 'Tous les engins BTP'],
  ['🧰', 'Matériaux et équipements', 'Achetez près du chantier'],
  ['🏗️', 'Engins de chantier', 'À louer et à vendre'],
  ['📍', 'Terrains', 'Avec documents de propriété'],
  ['🏠', 'Immobilier', 'Maisons, immeubles, bureaux'],
  ['🛋️', 'Logement express', 'Villas courte durée'],
];

const PEOPLE = [
  'BTP Solutions',
  'Kossi Construction',
  'Quincaillerie Togo',
  'Afi Immobilier',
  'Transport Express',
  'Génie Civil Plus',
];

const initialMessages = [
  'Bonjour, comment pouvons-nous vous aider ?',
  'Nous pouvons vous proposer des artisans proches.',
];

export default function App() {
  const [screen, setScreen] = useState('home');
  const [balance, setBalance] = useState(125000);
  const [selectedService, setSelectedService] = useState('Artisans');
  const [selectedPerson, setSelectedPerson] = useState('BTP Solutions');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [images, setImages] = useState([]);

  const openScreen = (nextScreen) => setScreen(nextScreen);

  const goBack = () => {
    if (screen === 'service' || screen === 'chat' || screen === 'cash' || screen === 'publish' || screen === 'profile') {
      setScreen('home');
      return;
    }
    setScreen('home');
  };

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, trimmed]);
    setMessage('');
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 4,
    });

    if (!result.canceled) {
      setImages(result.assets.slice(0, 4));
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return (
          <HomeScreen
            balance={balance}
            onServicePress={(service) => {
              setSelectedService(service);
              setScreen('service');
            }}
          />
        );

      case 'service':
        return (
          <ServiceScreen
            title={selectedService}
            onBack={goBack}
            onPersonPress={(person) => {
              setSelectedPerson(person);
              setScreen('chat');
            }}
          />
        );

      case 'chat':
        return (
          <ChatScreen
            person={selectedPerson}
            messages={messages}
            value={message}
            onChangeText={setMessage}
            onSend={sendMessage}
            onBack={goBack}
            onAttachment={() => Alert.alert('Pièce jointe', 'Galerie / caméra / document / devis / carte PPC-Cash')}
          />
        );

      case 'cash':
        return (
          <CashScreen
            balance={balance}
            onBack={goBack}
            onRecharge={() => {
              setBalance((value) => value + 5000);
              Alert.alert('Recharge réussie', 'Votre compte PPC-Cash a été rechargé.');
            }}
            onPay={() => Alert.alert('Paiement', 'Paiement réussi avec succès.')}
            onWithdraw={() => Alert.alert('Retrait', 'Retrait envoyé avec succès.')}
          />
        );

      case 'publish':
        return (
          <PublishScreen
            images={images}
            onPick={pickImages}
            onBack={goBack}
            onSubmit={() => Alert.alert('Publication', 'Votre article a été publié.')}
          />
        );

      case 'profile':
        return (
          <ProfileScreen onBack={goBack} />
        );

      default:
        return (
          <HomeScreen
            balance={balance}
            onServicePress={(service) => {
              setSelectedService(service);
              setScreen('service');
            }}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>{renderScreen()}</View>
      <BottomNav active={screen} onPress={openScreen} />
    </SafeAreaView>
  );
}

function BottomNav({ active, onPress }) {
  const tabs = [
    { key: 'home', label: 'Accueil', icon: '⌂' },
    { key: 'chat', label: 'Messages', icon: '💬' },
    { key: 'cash', label: 'PPC-Cash', icon: '₣' },
    { key: 'publish', label: 'Publier', icon: '+' },
    { key: 'profile', label: 'Profil', icon: '♙' },
  ];

  return (
    <View style={styles.navBar}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          onPress={() => onPress(tab.key)}
          style={[styles.navItem, active === tab.key && styles.navItemActive]}
        >
          <Text style={styles.navIcon}>{tab.icon}</Text>
          <Text style={[styles.navLabel, active === tab.key && styles.navLabelActive]}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function HomeScreen({ balance, onServicePress }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.heroBanner}>
        <Text style={styles.heroSmall}>La plateforme qui vous accompagne</Text>
        <Text style={styles.heroTitle}>Artisans Togo</Text>
        <Text style={styles.heroText}>Construisez, achetez et trouvez les bons professionnels.</Text>
      </View>

      <View style={styles.walletCard}>
        <Text style={styles.walletLabel}>Votre solde PPC-Cash</Text>
        <Text style={styles.walletAmount}>{balance.toLocaleString('fr-FR')} FCFA</Text>
      </View>

      <Text style={styles.sectionTitle}>Que recherchez-vous ?</Text>

      {SERVICES.map(([icon, title, subtitle], index) => (
        <Pressable key={`${title}-${index}`} onPress={() => onServicePress(title)} style={styles.serviceCard}>
          <Text style={styles.serviceIcon}>{icon}</Text>
          <View style={styles.serviceTextWrap}>
            <Text style={styles.serviceTitle}>{title}</Text>
            <Text style={styles.serviceSubtitle}>{subtitle}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function ServiceScreen({ title, onBack, onPersonPress }) {
  return (
    <View style={styles.screen}>
      <Header title={title} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        {PEOPLE.map((person, index) => (
          <Pressable key={`${person}-${index}`} onPress={() => onPersonPress(person)} style={styles.personRow}>
            <View style={styles.avatarCircle}><Text style={styles.avatarText}>{person.slice(0, 2).toUpperCase()}</Text></View>
            <View style={styles.personInfo}>
              <Text style={styles.personName}>{person}</Text>
              <Text style={styles.personMeta}>{(index + 1) * 1.3} km · Disponible</Text>
            </View>
            <Text style={styles.linkText}>Voir</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function ChatScreen({ person, messages, value, onChangeText, onSend, onBack, onAttachment }) {
  return (
    <View style={styles.screen}>
      <Header title={person} onBack={onBack} />

      <ScrollView contentContainerStyle={styles.chatContent}>
        {messages.map((msg, index) => (
          <View
            key={`${msg}-${index}`}
            style={[styles.chatBubble, index % 2 === 1 && styles.chatBubbleMine]}
          >
            <Text style={styles.chatBubbleText}>{msg}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.chatInputBar}>
        <Pressable onPress={onAttachment}>
          <Text style={styles.attachIcon}>📎</Text>
        </Pressable>
        <Pressable onPress={onAttachment}>
          <Text style={styles.attachIcon}>📷</Text>
        </Pressable>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Écrire un message"
          style={styles.messageInput}
        />

        <Pressable onPress={onSend} style={styles.sendButton}>
          <Text style={styles.sendIcon}>{value.trim() ? '➤' : '🎤'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function CashScreen({ balance, onBack, onRecharge, onPay, onWithdraw }) {
  return (
    <View style={styles.screen}>
      <Header title="PPC-Cash" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.walletCard}>
          <Text style={styles.walletLabel}>Solde PPC-Cash</Text>
          <Text style={styles.walletAmount}>{balance.toLocaleString('fr-FR')} FCFA</Text>
        </View>

        <Pressable onPress={onRecharge} style={styles.actionCard}>
          <Text style={styles.actionIcon}>↥</Text>
          <Text style={styles.actionText}>Recharger PPC-Cash</Text>
        </Pressable>

        <Pressable onPress={onPay} style={styles.actionCard}>
          <Text style={styles.actionIcon}>⇄</Text>
          <Text style={styles.actionText}>Payer / Transférer</Text>
        </Pressable>

        <Pressable onPress={onWithdraw} style={styles.actionCard}>
          <Text style={styles.actionIcon}>↧</Text>
          <Text style={styles.actionText}>Retirer de l’argent</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function PublishScreen({ images, onPick, onBack, onSubmit }) {
  return (
    <View style={styles.screen}>
      <Header title="Publier" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Déposer vos articles ici</Text>

          <Pressable onPress={onPick} style={styles.uploadBox}>
            <Text style={styles.uploadIcon}>＋</Text>
            <Text style={styles.uploadText}>Ajouter jusqu’à 4 images ({images.length}/4)</Text>
          </Pressable>

          <TextInput placeholder="Nom de l’article" style={styles.input} />
          <TextInput placeholder="Prix (FCFA)" keyboardType="numeric" style={styles.input} />
          <TextInput placeholder="Description" multiline style={[styles.input, styles.textArea]} />
          <TextInput placeholder="Ville" style={styles.input} />
          <TextInput placeholder="Quartier" style={styles.input} />

          <Pressable style={styles.primaryButton} onPress={onSubmit}>
            <Text style={styles.primaryButtonText}>Envoyer</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function ProfileScreen({ onBack }) {
  const items = [
    'Mon compte Artisans Togo',
    'Parrainage',
    'À propos d’Artisans Togo',
    'Déconnexion',
  ];

  return (
    <View style={styles.screen}>
      <Header title="Profil" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        {items.map((item, index) => (
          <Pressable key={`${item}-${index}`} style={styles.actionCard}>
            <Text style={styles.actionIcon}>{index === 0 ? '👤' : index === 1 ? '🎁' : index === 2 ? 'ⓘ' : '↪'}</Text>
            <Text style={styles.actionText}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function Header({ title, onBack }) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.backButtonSpacer} />
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.backButtonSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 18,
    paddingBottom: 32,
  },
  header: {
    height: 64,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonSpacer: {
    width: 32,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 32,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    flex: 1,
  },
  heroBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
  },
  heroSmall: {
    color: '#d5fffa',
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
    marginVertical: 10,
  },
  heroText: {
    color: '#d5fffa',
    fontSize: 15,
  },
  walletCard: {
    backgroundColor: COLORS.navy,
    padding: 20,
    borderRadius: 18,
    marginBottom: 18,
  },
  walletLabel: {
    color: '#d5e2ef',
    fontSize: 12,
  },
  walletAmount: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 10,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    fontSize: 28,
    width: 38,
  },
  serviceTextWrap: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  serviceSubtitle: {
    marginTop: 4,
    color: COLORS.muted,
    fontSize: 12,
  },
  personRow: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ccfbf1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.primaryDark,
    fontWeight: '900',
  },
  personInfo: {
    flex: 1,
    marginLeft: 12,
  },
  personName: {
    fontWeight: '800',
    color: COLORS.text,
  },
  personMeta: {
    color: COLORS.muted,
    marginTop: 4,
    fontSize: 12,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  chatContent: {
    padding: 18,
    paddingBottom: 100,
  },
  chatBubble: {
    maxWidth: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chatBubbleMine: {
    backgroundColor: COLORS.mint,
    alignSelf: 'flex-end',
  },
  chatBubbleText: {
    color: COLORS.text,
    fontSize: 15,
  },
  chatInputBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attachIcon: {
    fontSize: 22,
    color: COLORS.muted,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.text,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    color: '#fff',
    fontSize: 18,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    width: 30,
  },
  actionText: {
    color: COLORS.text,
    fontWeight: '700',
    marginLeft: 10,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 16,
    color: COLORS.text,
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#99f6e4',
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdfa',
    marginBottom: 18,
  },
  uploadIcon: {
    fontSize: 36,
    color: COLORS.primary,
    marginBottom: 6,
  },
  uploadText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    color: COLORS.text,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
  navBar: {
    flexDirection: 'row',
    height: 72,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    backgroundColor: '#f0fdfa',
  },
  navIcon: {
    fontSize: 22,
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 2,
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
