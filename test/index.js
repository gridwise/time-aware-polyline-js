var should = require('chai').should(),
polyline = require('../index'),
decoder = polyline.decodeTimeAwarePolyline,
encoder = polyline.encodeTimeAwarePolyline,
locationFinder = polyline.getLocationsAtTimestamps,
getLocationsElapsed = polyline.getLocationsElapsedByTimestamp,
getPolylineSegments = polyline.getPolylineSegmentsForLocationsElapsed;

var points = [
    [19.13626, 72.92506, '2016-07-21T05:43:09.000Z'],
    [19.13597, 72.92495, '2016-07-21T05:43:15.000Z'],
    [19.13553, 72.92469, '2016-07-21T05:43:21.000Z']
];

var pointsWithDuplicates = [
    [19.13626, 72.92506, '2016-07-21T05:43:09.000Z'],
    [19.13597, 72.92495, '2016-07-21T05:43:15.000Z'],
    [19.13553, 72.92469, '2016-07-21T05:43:21.000Z'],
    [19.13553, 72.92469, '2016-07-21T05:43:22.000Z'],
    [19.13553, 72.92469, '2016-07-21T05:43:23.000Z']
];

var pointsToSplit = [
    [19.13626, 72.92506, '2016-07-21T05:43:09.000Z'],
    [19.20000, 72.20000, '2016-07-21T05:54:09.000Z'],
    [19.201, 72.201, '2016-07-21T05:55:09.000Z']
];

var encoded = 'spxsBsdb|Lymo`qvAx@TKvAr@K';

var timeStampsToFind = [
    '2016-07-21T05:43:21.000Z', // exact match with third
    '2016-07-21T05:43:11.000Z', // between first and second
    '2016-07-21T05:43:41.000Z', // after last time
    '2016-07-21T05:43:08.000Z', // before first time
];

var locationsFound = [
    [19.13553, 72.92469],
    [19.136163333333336, 72.92502333333334],
    [19.13553, 72.92469],
    [19.13626, 72.92506],
];

var timeStampToFind1 = timeStampsToFind[1];
var timeStampToFind2 = timeStampsToFind[0];

var locationsElapsed1 = [
    [19.13626, 72.92506],
    [19.136163333333336, 72.92502333333334]
];

var locationsElapsed2 = [
    [19.13626, 72.92506],
    [19.13597, 72.92495],
    [19.13553, 72.92469]
];

var locationsElapsedWithDuplicates = [
    [19.13626, 72.92506],
    [19.13597, 72.92495],
    [19.13553, 72.92469],
    [19.13553, 72.92469],
    [19.13553, 72.92469]
];

var timeStampForDuplicates = '2016-07-21T05:43:23.000Z';

var segmentTest = [
    [19.04076, 73.00895, '2017-01-16T05:29:42+00:00'],
    [19.04049, 73.00895, '2017-01-16T05:31:04+00:00'],
    [19.04107, 73.00896, '2017-01-16T06:09:28+00:00'],
    [19.04099, 73.00969, '2017-01-16T06:12:16+00:00'],
    [19.0415, 73.00972, '2017-01-16T06:13:51+00:00'],
    [19.04185, 73.00974, '2017-01-16T06:13:56+00:00'],
    [19.1038, 72.89738, '2017-01-16T07:50:54+00:00'],
    [19.10445, 72.89765, '2017-01-16T07:54:04+00:00'],
    [19.1038, 72.89738, '2017-01-16T07:56:04+00:00']
];

var complicatedPolyline = "g~prBewp{Lywq|mwAjBE????OhC????tBL????@K?BK?BK?FK?DI?FI?FG?HI????FG????@[????UI????FI?BCA??APFAH@A??AJ@A@?U@?A??ATBAN@Af@DAV@G??GL@EX?C??AL?Aj@BEj@@Eb@@C@?ALBAF@A???DDARP?@?CVZCFFAJRA@BALVA??A^XA??EHFA???BB?@@AZR?\TA??AFBAJDC??A^LAf@PIh@PGb@NE`@NE`@NA??AB@Ab@LCDBCLBCRDCF?ALBCV@Cd@BId@BGD?Ef@BA??AFCADC?F??P??b@@Aj@@A??AB??f@NGD@Q??QZNQTLCRNA@@AJJELRCNXCBFAJXCDJAPd@G??C??CRb@CTb@G??GB?EF?G@?EB?A??A@?A??AF@AFB?BB?B@A@B?BB?@@??@ABB??D????@B?@F??DA????D??B?AB??@??@AAB?AB?AB?CB????CD?CB?C@?A?ACBAE@?C?AE@AE????AET?GZIKj@GETA??AALAGf@CGd@AGl@EIj@EARCEPAAFCIZAEPCERAA@AOh@A??AD@AH@CLBA@?Gd@BEh@Ds@r@FKf@DAf@BE^DCD?An@DEj@DEd@BEh@DEh@DGD?AvAB?V????AjE|G???AXf@?zA~B?Tj@AH\?BP???ADZA?RA??AhJtB???AXJAPH?NHALHARL???A|EzD?dF~DC??CMTC??CgI}GCw@q@qPi@c@cPUSE??ESIGMGEa@QWSGUaAWa@MCO??O{@SOiAWwMoA[Gy@QQEAm@??C??Ao@MC}@QIWEC??Ak@KCKAEo@IEYEC??C_@ACIAEq@GEK?C??CELCGHCOXCw@p@yAn@aAg@FKe@DKg@FMg@??e@DSg@??g@NBg@??e@t@Fg@l@D{@??{@J@{@N@{Cp@J}Ct@JID@A??AZFCl@LA??Cp@LE??_AB?_A@?At@RAnBb@G|Bf@K~@TA??CXJADBCJDANHALHCJHAFBA???DCA@?A@?AH@?FBAp@PAn@Nq@v@RS\JYmBg@a@o@OkyDa@MkPIAkPA?kPA?kPEBmP??AIHA??CSIAWMAWKMu@SKm@OE??C_AUCoBc@Iy@SKk@MA????SA????SAE[????CQAI]?Uk@A{A_C?Yg@A???kE}G???EuEwGCq_Dn|EobAKBAQ??]CA???eBuA???Aq@c@???AqDuB?{BcAA???sAo@?gAe@igDa@SgAc@SE??CoAc@C??CM@CE?EMCC??C_BaAC??CcBcAC??AHOC??AFACD?AF?CH@AJ@CLBAb@LCL@AJ?CFCAFACHEAHCAROCDGADICBGA?EC@EAAOC?EA?GG??GAGGC]G??EAWECi@C?QC?CC@IAFIAJIALEA@ACNE?VI?LCALCCNEE??EPGELGEBEELKAJOAFQADMAFQCDMADOCDSCDc@C@ICBa@CDs@C@GA??CPsACT}AKHi@C??C@BCRRI~@bAKHJEp@v@EhAnAMFF?|@`AADFChAnAEXZA??Ab@f@AHJCd@n@Kb@h@A??CBDC`@l@KJLEb@h@Ef@l@Kh@n@MPTG??GDFGLLKd@h@Kb@d@Wb@f@UBB????\`@?HPAHN?JN???AJJ???AF??B?A@??B?ABA????BEA?C?AEAAC?GIA???SY?W_@A]i@?Sg@AM[?CKAGSE??GGQE??GISEAAE?AGA?A??AYm@A?AA??AIYASw@KGW[??[Og@[?CAOw@A??CACAGUAAGA[i@A??C?AAAAA_@s@MKQAO[A??C??AWs@K??A?A?Q_@AEGA???GKA?AAKQAOQACCC??AEEAEGEQMCSMECAEUIAKCC??AMECGCAWIAOECGCAGCCCAAKICMMEKKCIMCKMEMSCMQESe@EO]COa@E?AA??AACCYe@AKOAIKC_@s@EKSA??AQa@C?AAKa@EGSEISA??AGK???ACKA??ACEAM_@EUi@E??CU_@EGKCa@w@EGSEKUEWeAE?ACYeACAACQi@CQYEw@cAw@a@c@EMMEMMAOKCIGAa@MCmAc@KQGAKCAME???AC?AI@?MC????WMA???G\?Ox@AABCG?AG?AGAC??A??A??Ko@SMy@UA??AA?COGCc@MCQEA??Cm@QAoA]A}@UI_@K???AI|A????rElAA???QbAA?@?C@?{D{@AEE????AAADqA???A?A?FcAI@W???AxBl@?jAZATFeE??eEb@LeEPDsVNFsVb@LsVfAZ???AF@AF?AF?A@CANw@AF_@A??AYOA??AUKA???UI???A@O???C?ICAKECKCIa@CAEE??CEKCIOEKWAOc@CGOCGSAMc@CAECI]CKg@C?AEGc@cAC]cA??CAMCCk@C??C?OC@]A??C?mAC?EA@u@AFy@C?EAFi@CFe@E@GC??CNeAC@CCNoAE??K??A??I??AHYC??AJ_@CRm@Idd@}d@K???b@_@AbA{@???AlA_A???An@i@?rDkCAx@m@?x@g@A???f@W?fB}@?jAo@????h@WArAo@?vAo@????pAg@?x@YATKA??Ad@YCFCSTOU??Sr@SUl@QCFAEr@QSj@OoJ??qJv@QqJt@QoJJCqJj@MCv@OA??CXEAfAQEl@GChBUEB?Ep@EA??Cf@EATAAH?A??AdAGC??Ah@CAb@CA??AhACC??Ab@?AX?EtB?C@?GnA?Gh@?I??IZ@IvADKhADC??AX@CpBLIVBA??CrAPAb@DA`@DA??CpAPAXFA~@NA??AVFC??AXFAD@EvBd@Eb@JC??CnA^CVHEv@VEn@TE??CHYI\gAIXaAKVw@KX}@Kb@wAKb@wAC??AV}@CPi@???AEC?CA?CC?CCAAE??C??C???A?G?@C?@E?BCA@A????DC?DAAB??D??D@A???DM?Ty@INi@AT{@?V_AC??ADOCn@_CIHUQ??ABSC??AX?A`ABKrA@UT@K??IbA@KhB@KnABKR?KJ?G??Eb@@Gx@[uBf@g@C??CDYC?CGH}@?BOA???BOADMCDOA??ADOCDOAFUAL]C?AAFUA??AVFA??ANB?NBAB?AfAHKv@FKv@FIv@FEF?Ex@FMhAFKrAJK@?Et@BC`@?AV?C??ABCANSAHM?JS???AVo@???Gl@wAI^_AA\y@I@EAJUA??CDMA??ABBAVJMj@ZATLA??C\NA??CD@A~@VS??A??AbAn@A??ALHAZNC??Ct@d@ChAp@KDBA??AP\C??Ad@XA??G@????Af@f@?JJ?f@f@C??ADDC??ADD???A`@`@?f@h@KLLC??CXZCn@p@OHJE??CEFE]j@W";

describe('#decoder', function() {
    it('decodes polyline', function() {
        decoder(encoded).should.deep.equal(points);
    });

    it('finds locations', function() {
        locationFinder(
            points, timeStampsToFind
        ).should.deep.equal(locationsFound);
    });

    it('locations traveled', function() {
        getLocationsElapsed(
            points, timeStampToFind1
        ).should.deep.equal(
            {'path': locationsElapsed1, 'bearing': -160.28}
        );

        getLocationsElapsed(
            points, timeStampToFind2
        ).should.deep.equal(
            {'path': locationsElapsed2, 'bearing': -150.83}
        );

        getLocationsElapsed(
            pointsWithDuplicates, timeStampForDuplicates
        ).should.deep.equal(
            {'path': locationsElapsedWithDuplicates, 'bearing': -150.83}
        );

        getLocationsElapsed(
            // first timestamp, return only first location
            decoder(encoded), '2016-07-21T05:43:09.000Z'
        ).should.deep.equal(
            {'path': [[19.13626, 72.92506]], 'bearing': 0}
        );
    });

    it('creates polyline segments', function() {
        getPolylineSegments(
            pointsToSplit, '2016-07-21T05:57:09.000Z'
        ).should.deep.equal(
            [
                {'path': [[19.13626, 72.92506]], 'bearing': 0, 'style': 'solid'},
                {'path': [[19.13626, 72.92506], [19.20000, 72.20000]], 'bearing': -84.56, 'style': 'dotted'},
                {'path': [[19.20000, 72.20000], [19.201, 72.201]], 'bearing': 43.36, 'style': 'solid'}
            ]
        );

        getPolylineSegments(
            pointsToSplit, '2016-07-21T05:43:09.000Z'
        ).should.deep.equal(
            [
                {'path': [[19.13626, 72.92506]], 'bearing': 0, 'style': 'solid'}
            ]
        );

        getPolylineSegments(
            pointsToSplit, '2016-07-21T05:54:30.000Z'
        ).should.deep.equal(
            [
                {'path': [[19.13626, 72.92506]], 'bearing': 0, 'style': 'solid'},
                {'path': [[19.13626, 72.92506], [19.20000, 72.20000]], 'bearing': -84.56, 'style': 'dotted'},
                // next point is a midpoint
                {'path': [[19.20000, 72.20000], [19.20035, 72.20035]], 'bearing': 43.36, 'style': 'solid'}
            ]
        );

        getPolylineSegments(
            segmentTest, '2017-01-16T07:56:04+00:00'
        ).should.deep.equal(
            [
                {'path': [[19.04076, 73.00895], [19.04049, 73.00895], [19.04107, 73.00896], [19.04099, 73.00969], [19.0415, 73.00972], [19.04185, 73.00974]], 'bearing': 3.09, 'style': 'solid'},
                {'path': [[19.04185, 73.00974], [19.1038, 72.89738]], 'bearing': -59.72, 'style': 'dotted'},
                {'path': [[19.1038, 72.89738], [19.10445, 72.89765], [19.1038, 72.89738]], 'bearing': -158.57, 'style': 'solid'}
            ]
        );
    });

    it('decodes complicated polyline', function() {
        var decoded = decoder(complicatedPolyline);
        var data = getLocationsElapsed(decoded, '2017-01-12T11:16:29.000Z');

        data.should.deep.equal(
            {'path': [[18.93364, 72.83587]], 'bearing': 0}
        )
    });
});

describe('#encoder', function() {
    it('encodes polyline', function() {
        encoder(points).should.equal(encoded);
    });
});
