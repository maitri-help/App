module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            'module:react-native-dotenv',
            {
                moduleName: '@env',
                path: '.env',
                blacklist: null,
                whitelist: null,
                safe: false,
                allowUndefined: true
            }
        ],
        'react-native-reanimated/plugin'
    ],
    overrides: [
        // this plugins crashes react native maps markers
        {
            test: (fileName) =>
                !fileName.includes('node_modules/react-native-maps'),
            plugins: [
                [
                    require('@babel/plugin-transform-private-methods'),
                    { loose: true }
                ]
            ]
        }
    ]
};
