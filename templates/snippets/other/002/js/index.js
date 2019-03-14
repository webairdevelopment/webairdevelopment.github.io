const copyToClipboard = str => {
	const el = document.createElement("textarea");
	el.value = str;
	document.body.appendChild(el);
	el.select();
	document.execCommand("copy");
	document.body.removeChild(el);
};

var eleSaying = document.querySelector(".saying");

var Tags;
(function(Tags) {
	Tags["Abundance"] = "Abundance";
	Tags["Achieving Enlightenment"] = "Achieving Enlightenment";
	Tags["Act"] = "Act";
	Tags["Alone"] = "Alone";
	Tags["Along"] = "Along";
	Tags["Always"] = "Always";
	Tags["Angels"] = "Angels";
	Tags["Anger"] = "Anger";
	Tags["Arrive"] = "Arrive";
	Tags["Bad"] = "Bad";
	Tags["Be True"] = "Be True";
	Tags["Beauty"] = "Beauty";
	Tags["Because"] = "Because";
	Tags["Become"] = "Become";
	Tags["Been"] = "Been";
	Tags["Behavior"] = "Behavior";
	Tags["Being Noble"] = "Being Noble";
	Tags["Believe"] = "Believe";
	Tags["Best"] = "Best";
	Tags["Better"] = "Better";
	Tags["Binary"] = "Binary";
	Tags["Bitterness"] = "Bitterness";
	Tags["Body"] = "Body";
	Tags["Born"] = "Born";
	Tags["Broken"] = "Broken";
	Tags["Candle"] = "Candle";
	Tags["Care"] = "Care";
	Tags["Changing the World"] = "Changing the World";
	Tags["Chaos"] = "Chaos";
	Tags["Charity"] = "Charity";
	Tags["Communication"] = "Communication";
	Tags["Compassion"] = "Compassion";
	Tags["Death"] = "Death";
	Tags["Depend"] = "Depend";
	Tags["Deserve"] = "Deserve";
	Tags["Determination"] = "Determination";
	Tags["Diligence"] = "Diligence";
	Tags["Does"] = "Does";
	Tags["Done"] = "Done";
	Tags["Doubt"] = "Doubt";
	Tags["Dream"] = "Dream";
	Tags["Drop"] = "Drop";
	Tags["Enemy"] = "Enemy";
	Tags["Envy"] = "Envy";
	Tags["Eternal"] = "Eternal";
	Tags["Everything"] = "Everything";
	Tags["Evil"] = "Evil";
	Tags["Failure"] = "Failure";
	Tags["Falls"] = "Falls";
	Tags["Family"] = "Family";
	Tags["Fate"] = "Fate";
	Tags["Fear"] = "Fear";
	Tags["Feared"] = "Feared";
	Tags["Feel"] = "Feel";
	Tags["Feels"] = "Feels";
	Tags["Fills"] = "Fills";
	Tags["Find"] = "Find";
	Tags["Fire"] = "Fire";
	Tags["Foot"] = "Foot";
	Tags["Free"] = "Free";
	Tags["Friends and Relationships"] = "Friends and Relationships";
	Tags["Future"] = "Future";
	Tags["Gift"] = "Gift";
	Tags["Good Health"] = "Good Health";
	Tags["Good"] = "Good";
	Tags["Grain"] = "Grain";
	Tags["Gratitude"] = "Gratitude";
	Tags["Ground"] = "Ground";
	Tags["Growth"] = "Growth";
	Tags["Happiness"] = "Happiness";
	Tags["Hatred"] = "Hatred";
	Tags["He"] = "He";
	Tags["Health"] = "Health";
	Tags["Heart"] = "Heart";
	Tags["Hell"] = "Hell";
	Tags["Hidden"] = "Hidden";
	Tags["Him"] = "Him";
	Tags["Holding On"] = "Holding On";
	Tags["Hot"] = "Hot";
	Tags["I Am"] = "I Am";
	Tags["Idea"] = "Idea";
	Tags["Ignorance"] = "Ignorance";
	Tags["Inspirational"] = "Inspirational";
	Tags["Itself"] = "Itself";
	Tags["Joy"] = "Joy";
	Tags["Jug"] = "Jug";
	Tags["King"] = "King";
	Tags["Laws"] = "Laws";
	Tags["Leader"] = "Leader";
	Tags["Life"] = "Life";
	Tags["Like"] = "Like";
	Tags["Listening"] = "Listening";
	Tags["Live"] = "Live";
	Tags["Lived"] = "Lived";
	Tags["Living In The Present Moment"] = "Living In The Present Moment";
	Tags["Long"] = "Long";
	Tags["Love"] = "Love";
	Tags["Loved"] = "Loved";
	Tags["Lust"] = "Lust";
	Tags["Make"] = "Make";
	Tags["Man"] = "Man";
	Tags["May"] = "May";
	Tags["Meditation"] = "Meditation";
	Tags["Men"] = "Men";
	Tags["Mind"] = "Mind";
	Tags["Mistakes"] = "Mistakes";
	Tags["Moment"] = "Moment";
	Tags["Moon"] = "Moon";
	Tags["More"] = "More";
	Tags["Never"] = "Never";
	Tags["Noble"] = "Noble";
	Tags["Nothing"] = "Nothing";
	Tags["Obedience"] = "Obedience";
	Tags["One Word"] = "One Word";
	Tags["Only"] = "Only";
	Tags["Others"] = "Others";
	Tags["Our"] = "Our";
	Tags["Ourselves"] = "Ourselves";
	Tags["Out"] = "Out";
	Tags["Own"] = "Own";
	Tags["Past"] = "Past";
	Tags["Path"] = "Path";
	Tags["Peace Of Mind"] = "Peace Of Mind";
	Tags["Peace"] = "Peace";
	Tags["People"] = "People";
	Tags["Punished"] = "Punished";
	Tags["Pure"] = "Pure";
	Tags["Reach"] = "Reach";
	Tags["Real"] = "Real";
	Tags["Relationship"] = "Relationship";
	Tags["Religion"] = "Religion";
	Tags["Remain"] = "Remain";
	Tags["Remains"] = "Remains";
	Tags["Righteousness"] = "Righteousness";
	Tags["Road"] = "Road";
	Tags["Rule"] = "Rule";
	Tags["Salvation"] = "Salvation";
	Tags["Search"] = "Search";
	Tags["See"] = "See";
	Tags["Seed"] = "Seed";
	Tags["Seek"] = "Seek";
	Tags["Seen"] = "Seen";
	Tags["Self"] = "Self";
	Tags["Selfish"] = "Selfish";
	Tags["Shadow"] = "Shadow";
	Tags["She"] = "She";
	Tags["Short"] = "Short";
	Tags["Skin"] = "Skin";
	Tags["Someone"] = "Someone";
	Tags["Speak"] = "Speak";
	Tags["Speech"] = "Speech";
	Tags["Spiritual"] = "Spiritual";
	Tags["Strength"] = "Strength";
	Tags["Strive"] = "Strive";
	Tags["Striving"] = "Striving";
	Tags["Strong"] = "Strong";
	Tags["Suffering"] = "Suffering";
	Tags["Sun"] = "Sun";
	Tags["Sure"] = "Sure";
	Tags["Than"] = "Than";
	Tags["Them"] = "Them";
	Tags["Things"] = "Things";
	Tags["Think"] = "Think";
	Tags["Those"] = "Those";
	Tags["Thought"] = "Thought";
	Tags["Thoughts"] = "Thoughts";
	Tags["Three"] = "Three";
	Tags["Through"] = "Through";
	Tags["Time"] = "Time";
	Tags["Together"] = "Together";
	Tags["Transformed"] = "Transformed";
	Tags["Travel"] = "Travel";
	Tags["True"] = "True";
	Tags["Truth"] = "Truth";
	Tags["Two"] = "Two";
	Tags["Unity"] = "Unity";
	Tags["Universe"] = "Universe";
	Tags["Us"] = "Us";
	Tags["Victory"] = "Victory";
	Tags["Virtue"] = "Virtue";
	Tags["Virtues"] = "Virtues";
	Tags["Walk"] = "Walk";
	Tags["Way"] = "Way";
	Tags["Welcome"] = "Welcome";
	Tags["Well"] = "Well";
	Tags["Who"] = "Who";
	Tags["Wicked"] = "Wicked";
	Tags["Will"] = "Will";
	Tags["Win"] = "Win";
	Tags["Wisdom"] = "Wisdom";
	Tags["Wise Man"] = "Wise Man";
	Tags["Wise"] = "Wise";
	Tags["Wisely"] = "Wisely";
	Tags["Within"] = "Within";
	Tags["Without"] = "Without";
	Tags["Woes"] = "Woes";
	Tags["Woman"] = "Woman";
	Tags["Word"] = "Word";
	Tags["Words"] = "Words";
	Tags["Work"] = "Work";
	Tags["World"] = "World";
	Tags["Worthy"] = "Worthy";
	Tags["You"] = "You";
	Tags["Your Ideas"] = "Your Ideas";
	Tags["Your Mind"] = "Your Mind";
	Tags["Your Self"] = "Your Self";
	Tags["Your Words"] = "Your Words";
	Tags["Your"] = "Your";
	Tags["Yourself"] = "Yourself";
})(Tags || (Tags = {}));

var sources = [
	"https://ideapod.com/100-quotes-buddha-will-change-spend-life/",
	"https://BrainyQuote.Com"
];
var sayings = [
	{
		tags: [Tags["Living In The Present Moment"]],
		saying:
			"Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment."
	},
	{
		tags: [Tags["Living In The Present Moment"]],
		saying:
			"Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment."
	},
	{
		tags: [Tags["Living In The Present Moment"]],
		saying:
			"The secret of health for both mind and body is not to mourn for the past, nor to worry about the future, but to live the present moment wisely and earnestly."
	},
	{
		tags: [Tags["Living In The Present Moment"]],
		saying:
			"Every morning we are born again. What we do today is what matters most."
	},
	{
		tags: [Tags["Living In The Present Moment"]],
		saying: "Be where you are; otherwise you will miss your life."
	},
	{
		tags: [Tags["Living In The Present Moment"]],
		saying:
			"What you are is what you have been. What you’ll be is what you do now."
	},
	{
		tags: [Tags["Living In The Present Moment"]],
		saying: "It is better to travel well than to arrive."
	},
	{
		tags: [Tags["Achieving Enlightenment"]],
		saying:
			"No one saves us but ourselves. No one can and no one may. We ourselves must walk the path."
	},
	{
		tags: [Tags["Achieving Enlightenment"]],
		saying:
			"A man is not called wise because he talks and talks again; but if he is peaceful, loving and fearless then he is in truth called wise."
	},
	{
		tags: [Tags["Achieving Enlightenment"]],
		saying: "Purity or impurity depends on oneself, no one can purify another."
	},
	{
		tags: [Tags["Achieving Enlightenment"]],
		saying:
			"Just as a snake sheds its skin, we must shed our past over and over again."
	},
	{
		tags: [Tags["Achieving Enlightenment"]],
		saying: "Peace comes from within. Do not seek it without."
	},
	{
		tags: [Tags["Achieving Enlightenment"]],
		saying:
			"What is evil? Killing is evil, lying is evil, slandering is evil, abuse is evil, gossip is evil, envy is evil, hatred is evil, to cling to false doctrine is evil; all these things are evil. And what is the root of evil? Desire is the root of evil, illusion is the root of evil."
	},
	{
		tags: [Tags["Achieving Enlightenment"]],
		saying:
			"To insist on a spiritual practice that served you in the past is to carry the raft on your back after you have crossed the river."
	},
	{
		tags: [Tags["Achieving Enlightenment"]],
		saying: "If you find no one to support you on the spiritual path, walk alone."
	},
	{
		tags: [Tags["Achieving Enlightenment"]],
		saying: "Stop, stop. Do not speak. The ultimate truth is not even to think."
	},
	{
		tags: [Tags["Achieving Enlightenment"]],
		saying:
			"The one in whom no longer exist the craving and thirst that perpetuate becoming; how could you track that Awakened one, trackless, and of limitless range."
	},
	{
		tags: [Tags["Achieving Enlightenment"]],
		saying:
			"Endurance is one of the most difficult disciplines, but it is to the one who endures that the final victory comes."
	},
	{
		tags: [Tags["Achieving Enlightenment"]],
		saying:
			"When you realize how perfect everything is you will tilt your head back and laugh at the sky."
	},
	{
		tags: [Tags["Achieving Enlightenment"]],
		saying: "The foot feels the foot when it feels the ground."
	},
	{
		tags: [Tags["Love"]],
		saying: "True love is born from understanding."
	},
	{
		tags: [Tags["Love"]],
		saying:
			"You, yourself, as much as anybody in the entire universe, deserve your love and affection."
	},
	{
		tags: [Tags["Love"]],
		saying: "You only lose what you cling to."
	},
	{
		tags: [Tags["Love"]],
		saying: "Radiate boundless love towards the entire world."
	},
	{
		tags: [Tags["Love"]],
		saying: "Ambition is like love, impatient both of delays and rivals."
	},
	{
		tags: [Tags["Love"]],
		saying:
			"Love is a gift of one’s inner most soul to another so both can be whole."
	},
	{
		tags: [Tags["Love"]],
		saying:
			"Hatred does not cease by hatred, but only by love; this is the eternal rule."
	},
	{
		tags: [Tags["Love"]],
		saying:
			"Just as a mother would protect her only child with her life, even so let one cultivate a boundless love towards all beings."
	},
	{
		tags: [Tags["Your Mind"]],
		saying:
			"There is nothing so disobedient as an undisciplined mind, and there is nothing so obedient as a disciplined mind."
	},
	{
		tags: [Tags["Your Mind"]],
		saying:
			"We are shaped by our thoughts; we become what we think. When the mind is pure, joy follows like a shadow that never leaves."
	},
	{
		tags: [Tags["Your Mind"]],
		saying:
			"All that we are is the result of what we have thought: it is founded on our thoughts and made up of our thoughts. If a man speak or act with an evil thought, suffering follows him as the wheel follows the hoof of the beast that draws the wagon…. If a man speak or act with a good thought, happiness follows him like a shadow that never leaves him."
	},
	{
		tags: [Tags["Your Mind"]],
		saying:
			"Whatever a monk keeps pursuing with his thinking and pondering, that becomes the inclination of his awareness."
	},
	{
		tags: [Tags["Your Mind"]],
		saying: "Nothing can harm you as much as your own thoughts unguarded."
	},
	{
		tags: [Tags["Your Mind"]],
		saying:
			"In the sky, there is no distinction of east and west; people create distinctions out of their own minds and then believe them to be true."
	},
	{
		tags: [Tags["Your Mind"]],
		saying:
			"Our life is shaped by our mind; we become what we think. Suffering follows an evil thought as the wheels of a cart follow the oxen that draws it."
	},
	{
		tags: [Tags["Your Mind"]],
		saying: "Remembering a wrong is like carrying a burden on the mind."
	},
	{
		tags: [Tags["Anger"]],
		saying:
			"You will not be punished for your anger, you will be punished by your anger."
	},
	{
		tags: [Tags["Anger"]],
		saying:
			"Holding on to anger is like grasping a hot coal with the intent of throwing it at someone else; you are the one who gets burned."
	},
	{
		tags: [Tags["Anger"]],
		saying:
			"Anger will never disappear so long as thoughts of resentment are cherished in the mind."
	},
	{
		tags: [Tags["Anger"]],
		saying:
			"Chaos is inherent in all compounded things. Strive on with diligence."
	},
	{
		tags: [Tags["Compassion"]],
		saying: "If your compassion does not include yourself, it is incomplete."
	},
	{
		tags: [Tags["Compassion"]],
		saying:
			"Thousands of candles can be lit from a single candle, and the life of the candle will not be shortened. Happiness never decreases by being shared."
	},
	{
		tags: [Tags["Compassion"]],
		saying:
			"Hatred does not cease through hatred at any time. Hatred ceases through love. This is an unalterable law."
	},
	{
		tags: [Tags["Compassion"]],
		saying:
			"As rain falls equally on the just and the unjust, do not burden your heart with judgement but rain your kindness equally on all."
	},
	{
		tags: [Tags["Compassion"]],
		saying:
			"A generous heart, kind speech, and a life of service and compassion are the things which renew humanity."
	},
	{
		tags: [Tags["Compassion"]],
		saying:
			"If we fail to look after others when they need help, who will look after us?"
	},
	{
		tags: [Tags["Compassion"]],
		saying: "Happiness comes when your work and words are of benefit to others."
	},
	{
		tags: [Tags["Compassion"]],
		saying: "Give, even if you only have a little."
	},
	{
		tags: [Tags["Compassion"]],
		saying: "Life is so very difficult. How can we be anything but kind?"
	},
	{
		tags: [Tags["Compassion"]],
		saying:
			"We will develop and cultivate the liberation of mind by loving kindness, make it our vehicle, make it our basis, stabilize it, exercise ourselves in it, and fully perfect it."
	},
	{
		tags: [Tags["Compassion"]],
		saying:
			"As rain falls equally on the just and the unjust, do not burden your heart with judgments but rain your kindness equally on all."
	},
	{
		tags: [Tags["Compassion"]],
		saying: "Kindness should become the natural way of life, not the exception."
	},
	{
		tags: [Tags["Your Words"]],
		saying: "Better than a thousand hollow words, is one word that brings peace."
	},
	{
		tags: [Tags["Your Words"]],
		saying:
			"Whatever words we utter should be chosen with care for people will hear them and be influenced by them for good or ill."
	},
	{
		tags: [Tags["Your Words"]],
		saying: "The tongue like a sharp knife… Kills without drawing blood."
	},
	{
		tags: [Tags["Your Words"]],
		saying: "Better than a thousand hollow words is one word that brings peace."
	},
	{
		tags: [Tags["Your Words"]],
		saying:
			"If you propose to speak always ask yourself, is it true, is it necessary, is it kind."
	},
	{
		tags: [Tags["Your Words"]],
		saying:
			"Like a fine flower, beautiful to look at but without scent, fine words are fruitless in a man who does not act in accordance with them."
	},
	{
		tags: [Tags["Your Words"]],
		saying:
			"Speak only endearing speech, speech that is welcomed. Speech, when it brings no evil to others, is a pleasant thing."
	},
	{
		tags: [Tags["Doubt"]],
		saying:
			"There is nothing more dreadful than the habit of doubt. Doubt separates people. It is a poison that disintegrates friendships and breaks up pleasant relations. It is a thorn that irritates and hurts; it is a sword that kills."
	},
	{
		tags: [Tags["Doubt"]],
		saying:
			"Even as a solid rock is unshaken by the wind, so are the wise unshaken by praise or blame."
	},
	{
		tags: [Tags["Your Ideas"]],
		saying:
			"An idea that is developed and put into action is more important than an idea that exists only as an idea."
	},
	{
		tags: [Tags["Your Ideas"]],
		saying:
			"Believe nothing, no matter where you read it, or who said it, no matter if I have said it, unless it agrees with your own reason and your own common sense."
	},
	{
		tags: [Tags["Your Ideas"]],
		saying:
			"If you do not change direction, you may end up where you are heading."
	},
	{
		tags: [Tags["Your Ideas"]],
		saying:
			"Just as the great ocean has one taste, the taste of salt, so also this teaching and discipline has one taste, the taste of liberation."
	},
	{
		tags: [Tags["Your Ideas"]],
		saying:
			"Long is the night to him who is awake; long is a mile to him who is tired; long is life to the foolish who do not know the true law."
	},
	{
		tags: [Tags["Your Ideas"]],
		saying:
			"Our theories of the eternal are as valuable as are those which a chick which has not broken its way through its shell might form of the outside world."
	},
	{
		tags: [Tags["Suffering"]],
		saying: "Pain is certain, suffering is optional."
	},
	{
		tags: [Tags["Suffering"]],
		saying:
			"Have compassion for all beings, rich and poor alike; each has their suffering. Some suffer too much, others too little."
	},
	{
		tags: [Tags["Suffering"]],
		saying: "The root of suffering is attachment."
	},
	{
		tags: [Tags["Your Self"]],
		saying:
			"No one saves us but ourselves. No one can and no one may. We ourselves must walk the path."
	},
	{
		tags: [Tags["Your Self"]],
		saying: "Doubt everything. Find your own light."
	},
	{
		tags: [Tags["Your Self"]],
		saying:
			"Believe nothing, no matter where you read it, or who said it, no matter if I have said it, unless it agrees with your own reason and your own common sense."
	},
	{
		tags: [Tags["Your Self"]],
		saying: "If you truly loved yourself, you could never hurt another."
	},
	{
		tags: [Tags["Your Self"]],
		saying: "Do not look for a sanctuary in anyone except your self."
	},
	{
		tags: [Tags["Your Self"]],
		saying:
			"There is no fire like passion, there is no shark like hatred, there is no snare like folly, there is no torrent like greed."
	},
	{
		tags: [Tags["Your Self"]],
		saying:
			"Set your heart on doing good. Do it over and over again, and you will be filled with joy."
	},
	{
		tags: [Tags["Your Self"]],
		saying:
			"Most problems, if you give them enough time and space, will eventually wear themselves out"
	},
	{
		tags: [Tags["Your Self"]],
		saying:
			"Irrigators channel waters; fletchers straighten arrows; carpenters bend wood; the wise master themselves."
	},
	{
		tags: [Tags["Your Self"]],
		saying:
			"Drop by drop is the water pot filled. Likewise, the wise man, gathering it little by little, fills himself with good."
	},
	{
		tags: [Tags["Your Self"]],
		saying: "You yourself must strive. The Buddhas only point the way."
	},
	{
		tags: [Tags["Your Self"]],
		saying:
			"Your work is to discover your world and then with all your heart give yourself to it."
	},
	{
		tags: [Tags["Your Self"]],
		saying:
			"She who knows life flows, feels no wear or tear, needs no mending or repair."
	},
	{
		tags: [Tags["Your Self"]],
		saying: "I am the miracle."
	},
	{
		tags: [Tags["Gratitude"]],
		saying:
			"Let us rise up and be thankful, for if we didn’t learn a lot at least we learned a little, and if we didn’t learn a little, at least we didn’t get sick, and if we got sick, at least we didn’t die; so, let us all be thankful."
	},
	{
		tags: [Tags["Gratitude"]],
		saying: "The way is not in the sky. The way is in the heart."
	},
	{
		tags: [Tags["Gratitude"]],
		saying:
			"To live a pure unselfish life, one must count nothing as one’s own in the midst of abundance."
	},
	{
		tags: [Tags["Fear"]],
		saying: "There is no fear for one whose mind is not filled with desires."
	},
	{
		tags: [Tags["Meditation"]],
		saying: "Meditate… do not delay, lest you later regret it."
	},
	{
		tags: [Tags["Death"]],
		saying:
			"Ardently do today what must be done. Who knows? Tomorrow, death comes."
	},
	{
		tags: [Tags["Death"]],
		saying: "Live every act fully, as if it were your last."
	},
	{
		tags: [Tags["Death"]],
		saying:
			"To be idle is a short road to death and to be diligent is a way of life; foolish people are idle, wise people are diligent."
	},
	{
		tags: [Tags["Happiness"]],
		saying: "One who acts on truth is happy in this world and beyond."
	},
	{
		tags: [Tags["Happiness"]],
		saying:
			"Happiness will never come to those who fail to appreciate what they already have."
	},
	{
		tags: [Tags["Happiness"]],
		saying:
			'A man asked Gautama Buddha, "I want happiness." Buddha said, "First remove I, that’s Ego, then remove want, that’s Desire. See now you are left with only Happiness."'
	},
	{
		tags: [Tags["Happiness"]],
		saying:
			"To support mother and father, to cherish wife and child and to have a simple livelihood; this is the good luck."
	},
	{
		tags: [Tags["Changing the World"]],
		saying:
			"One moment can change a day, one day can change a life and one life can change the world."
	},
	{
		tags: [Tags["Friends and Relationships"]],
		saying:
			"An insincere and evil friend is more to be feared than a wild beast; a wild beast may wound your body, but an evil friend will wound your mind."
	},
	{
		tags: [Tags["Friends and Relationships"]],
		saying:
			"Should a seeker not find a companion who is better or equal, let them resolutely pursue a solitary course."
	},
	{
		tags: [Tags["Friends and Relationships"]],
		saying: "He who loves 50 people has 50 woes; he who loves no one has no woes."
	},
	{
		tags: [Tags["Being Noble"]],
		saying:
			"One is not called noble who harms living beings. By not harming living beings one is called noble."
	},
	{
		tags: [Tags["Being Noble"]],
		saying:
			"Being deeply learned and skilled, being well trained and using well spoken words: this is good luck."
	},
	{
		tags: [
			Tags["Inspirational"],
			Tags["Relationship"],
			Tags["Best"],
			Tags["Gift"]
		],
		saying:
			"Health is the greatest gift, contentment the greatest wealth, faithfulness the best relationship."
	},
	{
		tags: [
			Tags["Life"],
			Tags["Future"],
			Tags["Moment"],
			Tags["Past"],
			Tags["Mind"],
			Tags["Dream"]
		],
		saying:
			"Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment."
	},
	{
		tags: [
			Tags["Life"],
			Tags["Live"],
			Tags["Candle"],
			Tags["Fire"],
			Tags["Spiritual"],
			Tags["Men"]
		],
		saying:
			"Just as a candle cannot burn without fire, men cannot live without a spiritual life."
	},
	{
		tags: [
			Tags["Strength"],
			Tags["Path"],
			Tags["Walk"],
			Tags["May"],
			Tags["Us"],
			Tags["Ourselves"]
		],
		saying:
			"No one saves us but ourselves. No one can and no one may. We ourselves must walk the path."
	},
	{
		tags: [
			Tags["Love"],
			Tags["Yourself"],
			Tags["Universe"],
			Tags["You"],
			Tags["Deserve"]
		],
		saying:
			"You, yourself, as much as anybody in the entire universe, deserve your love and affection."
	},
	{
		tags: [
			Tags["Truth"],
			Tags["Sun"],
			Tags["Moon"],
			Tags["Long"],
			Tags["Three"],
			Tags["Hidden"]
		],
		saying:
			"Three things cannot be long hidden: the sun, the moon, and the truth."
	},
	{
		tags: [
			Tags["Anger"],
			Tags["You"],
			Tags["Will"],
			Tags["Your"],
			Tags["Punished"]
		],
		saying:
			"You will not be punished for your anger, you will be punished by your anger."
	},
	{
		tags: [
			Tags["Work"],
			Tags["Religion"],
			Tags["Depend"],
			Tags["Others"],
			Tags["Own"],
			Tags["Out"]
		],
		saying: "Work out your own salvation. Do not depend on others."
	},
	{
		tags: [
			Tags["Man"],
			Tags["Evil"],
			Tags["Mind"],
			Tags["Enemy"],
			Tags["Him"],
			Tags["Own"]
		],
		saying:
			"It is a man's own mind, not his enemy or foe, that lures him to evil ways."
	},
	{
		tags: [
			Tags["Peace"],
			Tags["Thoughts"],
			Tags["Free"],
			Tags["Find"],
			Tags["Who"],
			Tags["Those"]
		],
		saying: "Those who are free of resentful thoughts surely find peace."
	},
	{
		tags: [Tags["Inspirational"], Tags["Think"], Tags["Become"]],
		saying: "What we think, we become."
	},
	{
		tags: [
			Tags["Truth"],
			Tags["King"],
			Tags["World"],
			Tags["Born"],
			Tags["Salvation"]
		],
		saying:
			"I was born into the world as the king of truth for the salvation of the world."
	},
	{
		tags: [
			Tags["Travel"],
			Tags["Better"],
			Tags["Well"],
			Tags["Arrive"],
			Tags["Than"]
		],
		saying: "It is better to travel well than to arrive."
	},
	{
		tags: [
			Tags["Peace"],
			Tags["Words"],
			Tags["Better"],
			Tags["One Word"],
			Tags["Word"]
		],
		saying: "Better than a thousand hollow words, is one word that brings peace."
	},
	{
		tags: [
			Tags["Mind"],
			Tags["Think"],
			Tags["You"],
			Tags["Become"],
			Tags["Everything"]
		],
		saying: "The mind is everything. What you think you become."
	},
	{
		tags: [
			Tags["Unity"],
			Tags["Two"],
			Tags["Only"],
			Tags["Binary"],
			Tags["Idea"],
			Tags["Itself"]
		],
		saying:
			"Unity can only be manifested by the Binary. Unity itself and the idea of Unity are already two."
	},
	{
		tags: [Tags["Peace"], Tags["Within"], Tags["Without"], Tags["Seek"]],
		saying: "Peace comes from within. Do not seek it without."
	},
	{
		tags: [
			Tags["Done"],
			Tags["Never"],
			Tags["See"],
			Tags["Only"],
			Tags["Been"],
			Tags["Remains"]
		],
		saying: "I never see what has been done; I only see what remains to be done."
	},
	{
		tags: [
			Tags["Love"],
			Tags["Hatred"],
			Tags["Only"],
			Tags["Eternal"],
			Tags["Rule"],
			Tags["Does"]
		],
		saying:
			"Hatred does not cease by hatred, but only by love; this is the eternal rule."
	},
	{
		tags: [Tags["Ground"], Tags["Foot"], Tags["Feels"]],
		saying: "The foot feels the foot when it feels the ground."
	},
	{
		tags: [
			Tags["Fear"],
			Tags["Death"],
			Tags["Lived"],
			Tags["Who"],
			Tags["Feared"],
			Tags["Wisely"]
		],
		saying: "Even death is not to be feared by one who has lived wisely."
	},
	{
		tags: [
			Tags["Life"],
			Tags["Failure"],
			Tags["Best"],
			Tags["True"],
			Tags["Be True"],
			Tags["Real"]
		],
		saying:
			"The only real failure in life is not to be true to the best one knows."
	},
	{
		tags: [
			Tags["Life"],
			Tags["Live"],
			Tags["Abundance"],
			Tags["Nothing"],
			Tags["Pure"]
		],
		saying:
			"To live a pure unselfish life, one must count nothing as one's own in the midst of abundance."
	},
	{
		tags: [Tags["Chaos"], Tags["Diligence"], Tags["Things"], Tags["Strive"]],
		saying:
			"Chaos is inherent in all compounded things. Strive on with diligence."
	},
	{
		tags: [
			Tags["Life"],
			Tags["Health"],
			Tags["Death"],
			Tags["Suffering"],
			Tags["Without"]
		],
		saying:
			"Without health life is not life; it is only a state of langour and suffering - an image of death."
	},
	{
		tags: [Tags["Drop"], Tags["Jug"], Tags["Fills"]],
		saying: "A jug fills drop by drop."
	},
	{
		tags: [
			Tags["Relationship"],
			Tags["People"],
			Tags["Who"],
			Tags["He"],
			Tags["Woes"]
		],
		saying: "He who loves 50 people has 50 woes; he who loves no one has no woes."
	},
	{
		tags: [
			Tags["Good"],
			Tags["Loved"],
			Tags["Virtue"],
			Tags["More"],
			Tags["Wicked"],
			Tags["Than"]
		],
		saying:
			"Virtue is persecuted more by the wicked than it is loved by the good."
	},
	{
		tags: [
			Tags["Wise"],
			Tags["Thought"],
			Tags["Speech"],
			Tags["Through"],
			Tags["Grain"]
		],
		saying:
			"The wise ones fashioned speech with their thought, sifting it as grain is sifted through a sieve."
	},
	{
		tags: [Tags["Mind"], Tags["Because"], Tags["Remain"], Tags["Transformed"]],
		saying:
			"All wrong-doing arises because of mind. If mind is transformed can wrong-doing remain?"
	},
	{
		tags: [
			Tags["Better"],
			Tags["Obedience"],
			Tags["Laws"],
			Tags["Righteousness"]
		],
		saying:
			"Better than worshiping gods is obedience to the laws of righteousness."
	}
];

function formatSaying(saying, html) {
	current = sayings.indexOf(saying);
	var t = "";
	saying["tags"].forEach((tag, i) => {
		if (html) {
			var text =
				onlyOne.indexOf(tag) === -1
					? `<a href="#" onclick="findFirstWithTag('${tag}')" title="Jump to first quote on '${tag}'">${tag.toLowerCase()}</a>`
					: tag.toLowerCase();
			t += `${i > 0 ? ", " : ""}${text}`;
		} else {
			t += `${i > 0 ? " #" : "#"}${tag}`;
		}
	});
	return html
		? `<span class="quote">“${
				saying.saying
			}”</span><span class="by">Said by Buddha on ${t}<span class="index">(#${current})</span></span>`
		: `"${saying.saying}"\n\n- Said by #Buddha on ${t}`;
}

var tagcounts = {};
sayings.forEach(s => {
	var tags = s.tags;
	tags.forEach(tag => {
		if (typeof tagcounts[tag] === "undefined") {
			tagcounts[tag] = 1;
		} else {
			tagcounts[tag]++;
		}
	});
});
var onlyOne = Object.keys(tagcounts).filter(tag => {
	return tagcounts[tag] === 1;
});

var keys = Object.keys(Tags);
var count = keys.length;
var randomTag;

var found, show, current;

function findRandomSaying() {
	do {
		randomTag = keys[parseInt(Math.random() * count)];
		found = sayings.filter(saying => {
			return saying.tags.indexOf(randomTag) > -1;
		});
	} while (found.length === 0);
	show = found[parseInt(Math.random() * found.length, 10)];
	showQuote();
}
function findFirstWithTag(tag) {
	event.cancelBubble = true;
	var found = sayings.filter(saying => {
		return saying.tags.indexOf(tag) > -1;
	});
	show = found[0];
	showQuote();
}
function showQuote() {
	eleSaying.innerHTML = formatSaying(show, true);
}
function showPrev(evt) {
	if (evt) {
		evt.cancelBubble = true;
		evt.preventDefault();
	}
	current--;
	if (current < 0) {
		current = sayings.length - 1;
	}
	show = sayings[current];
	showQuote();
	return false;
}
function showNext(evt) {
	if (evt) {
		evt.cancelBubble = true;
		evt.preventDefault();
	}
	current++;
	if (current > sayings.length - 1) {
		current = 0;
	}
	show = sayings[current];
	showQuote();
	return false;
}

function showAChoosenQuote(showNumber) {
	current = showNumber;
	show = sayings[current];
	showQuote();
}
document.querySelector(".random").addEventListener("click", findRandomSaying);

var pr = document.querySelector(".prev");
pr.addEventListener("click", showPrev);
var nx = document.querySelector(".next");
nx.addEventListener("click", showNext);

const doCopy = evt => {
	evt.cancelBubble = true;
	let quote = eleSaying.innerText;
	quote += "\nhttps://codepen.io/netsi1964/full/MZoQoj?show=" + current;
	alert("Copied to clipboard");
	copyToClipboard(quote);

	return false();
};

document.querySelector(".copy").addEventListener("click", doCopy);
const body = document.body;

var url = new URL(location.href);
var showNumber = url.searchParams.get("show");
if (showNumber) {
	showAChoosenQuote(showNumber);
} else {
	findRandomSaying();
}

function showAction(key) {
	body.classList.add(key);
	if (animateKey) {
		clearTimeout(animateKey);
	}
	animateKey = setTimeout(() => body.classList.remove(key), 300);
}

// Keyboard shortcuts
let animateKey;
window.addEventListener("keydown", evt => {
	let key = evt.key.toLowerCase();
	showAction(key);
	switch (key) {
		case "arrowright":
			showNext(evt);
			break;
		case "arrowleft":
			showPrev(evt);
			break;
		case "r":
			findRandomSaying();
			break;
		case "c":
			doCopy(evt);
			break;
	}
});

// Mouse wheel - swipe left or right
let wheelAction;
window.addEventListener("wheel", evt => {
	let { wheelDeltaX, wheelDeltaY } = evt;
	if (Math.abs(wheelDeltaX) > 30) {
		if (wheelAction) {
			window.clearTimeout(wheelAction);
		}
		wheelAction = window.setTimeout(() => {
			if (wheelDeltaX > 0) {
				showAction("arrowleft");
				showPrev(evt);
			} else {
				showAction("arrowright");
				showNext(evt);
			}
		}, 57);
	}
});